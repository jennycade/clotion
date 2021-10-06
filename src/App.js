import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { useHistory } from 'react-router';

import Sidebar from './Sidebar';
import PageLink from './PageLink';
import Page from './Page';
import Login from './Login';

import { rearrange } from './helpers';

// import { DbContext } from './firebase';
import { db, auth } from './firebase/db';

import { onSnapshot, collection, addDoc, orderBy, query, writeBatch, doc } from "firebase/firestore";
import { onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut } from 'firebase/auth';

import './App.css';

function App() {
  // state
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState('');
  const [dragFromId, setDragFromId] = useState('');
  const [lastDraggedOver, setLastDraggedOver] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  //////////
  // AUTH //
  //////////

  // sign-in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserDisplayName(user.displayName);
        } else {
          setUserDisplayName(user.email);
        }
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return () => unsub();
  }, []);

  const createNewEmailUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // const user = userCredential.user;
      setIsSignedIn(true);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Firebase auth error ${errorCode}: ${errorMessage}`);
    });
  }
  const signInEmailUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      setIsSignedIn(true);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Firebase auth error ${errorCode}: ${errorMessage}`);
    });
  }

  const signOutUser = () => {
    signOut(auth);
  }

  ///////////
  // PAGES //
  ///////////

  // load pages
  useEffect(() => {
    // query - sort by user-defined 'order'
    const pagesRef = collection(db, 'pages');
    const pagesQuery = query(pagesRef, orderBy('order'));
    const unsub = onSnapshot(pagesQuery, (pagesSnapshot) => {
      const newPages = [];
      pagesSnapshot.forEach((doc) => {
        const newPage = {id: doc.id, ...doc.data()}
        newPages.push(newPage);
      });
      setPages(newPages);
  });
    return unsub;
  }, []);

  /////////////
  // SIDEBAR //
  /////////////

  // manage sort order
  const getNextOrder = () => {
    // get max of all page.order values
    const orderVals = pages.map(page => page.order);
    return Math.max(...orderVals) + 1;
  }
  // dragging
  const handleSideBarPageDrag = (event, pageId) => {
    // don't allow dropping URL into page
    event.dataTransfer.clearData();

    // tell App what's being dragged
    setDragFromId(pageId);
  }
  const isSideBarPageDragLeaveReal = (pageId) => {
    // this doesn't quite work and I'm not sure why.
    if (pageId !== lastDraggedOver) {
      setLastDraggedOver(pageId);

      const pageBeingLeft = pages.find(page => page.id === pageId).title;
      console.log(`Leaving page ${pageBeingLeft}`);

      return true;
    }
  }

  // dropping
  const handleSideBarPageDrop = (beforeId = null) => {
    // calculate new order
    const newOrder = rearrange(pages, dragFromId, beforeId);
    // find pages to update
    const pagesToUpdate = pages.filter(item => {
      const newOrderForItem = newOrder.find( newOrderItem => newOrderItem.id === item.id ).newOrder;
      return newOrderForItem !== item.order;
    });

    // make a batched call to firebase
    // Get a new write batch
    const batch = writeBatch(db);
    pagesToUpdate.forEach(pageToUpdate => {
      const pageRef = doc(db, 'pages', pageToUpdate.id);
      const newOrderForPage = newOrder.find( newOrderItem => newOrderItem.id === pageToUpdate.id ).newOrder;
      batch.update(pageRef, {order: newOrderForPage});
    });

    // Commit the batch
    batch.commit();

    // unset the lastDraggedOver so highlights work as expected on next drag
    setLastDraggedOver('');

  }

  // addPage
  const addPage = async () => {
    // boilerplate
    const newPage = {
      title: 'Untitled',
      icon: '',
      content: JSON.stringify(
        [{
          type: 'paragraph',
          children: [{ text: 'Start typing.' }],
        }]
      ),
      order: getNextOrder(),
    };

    // add to firestore
    const docRef = await addDoc(collection(db, 'pages'), newPage);
    setNewPage(docRef.id);

  }

  if (!isSignedIn) {
    return (
      <Login
        createNewEmailUser={createNewEmailUser}
        signInEmailUser={signInEmailUser}
      />
    );
  }

  return (
    <Router>
      <div className="App">
        <Sidebar>
          <p>{userDisplayName}'s Clotion</p>
          <button onClick={ signOutUser }>Sign out</button>

          { pages.map( (page) => <PageLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } handleDrag={ handleSideBarPageDrag } isDragLeaveReal={ isSideBarPageDragLeaveReal } handleDrop={ handleSideBarPageDrop } />) }
          
          <div className="endSort" >
          </div>

          <button onClick={ addPage }
            onDrop={ () => handleSideBarPageDrop() } onDragOver={ (e) => e.preventDefault() } 
          >Add page</button>
          
        </Sidebar>

        { newPage !== '' &&
          <Redirect to={`/${newPage}`} />
        }

        <Switch>
          

          { pages.map((page) => {
            return (
              <Route path={ `/${page.id}/` } key={ page.id } exact>
                <Page id={ page.id } />
              </Route>
            )
          }) }
          
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
