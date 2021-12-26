import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { useHistory } from 'react-router';

import Sidebar from './Sidebar';
import PageLink from './PageLink';
import Page from './Page';
import Login from './Login';

import { rearrange, getDescendents, splicePageLinkInBlock } from './helpers';

// import { DbContext } from './firebase';
import { db, auth, googleProvider } from './firebase/db';

import { onSnapshot, collection, addDoc, setDoc, updateDoc, deleteDoc, orderBy, query, where, writeBatch, doc, getDocs } from "firebase/firestore";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut
} from 'firebase/auth';

import './App.css';

function App() {
  // state
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState('');
  const [dragFromId, setDragFromId] = useState('');
  const [lastDraggedOver, setLastDraggedOver] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [uid, setUid] = useState('');

  ///////////////////////
  // FAVICON AND TITLE //
  ///////////////////////

  const updateFavicon = (newEmoji) => {
    const faviconElement = document.getElementById("favicon");
    faviconElement.href=`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${newEmoji}</text></svg>`;
  }

  const updatePageTitle = (newTitle) => {
    const titleElement = document.getElementById('pageTitle');
    titleElement.innerText = newTitle;
  }

  //////////
  // AUTH //
  //////////

  // sign-in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        if (user.isAnonymous) {
          setUserDisplayName('Anonymous');
        } else if (user.displayName) {
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
  const sendForgottenPasswordEmail = (email) => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    alert('Sent password reset email');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Firebase auth error ${errorCode}: ${errorMessage}`);
  });
  }
  const signInGoogleUser = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setIsSignedIn(true);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Google sign in auth error ${errorCode}: ${errorMessage}`);
      });
  }
  const signInAsAnon = () => {
      signInAnonymously(auth)
    .then(() => {
      setIsSignedIn(true);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Anonymous sign in auth error ${errorCode}: ${errorMessage}`);
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
    if (uid !== '') {
      // query - sort by user-defined 'order'
      const pagesRef = collection(db, 'pages');
      const pagesQuery = query(pagesRef, where('uid', '==', uid), orderBy('order'));
      // const pagesQuery = query(pagesRef, orderBy('order'));
      const unsub = onSnapshot(pagesQuery, (pagesSnapshot) => {
        const newPages = [];
        pagesSnapshot.forEach((doc) => {
          const newPage = {id: doc.id, ...doc.data()}
          newPages.push(newPage);
        });
        setPages(newPages);
      });
      return unsub;
    }
  }, [uid]);

  // addPage
  const addPage = async (parentPage = null, isDbRow = false) => {
    // boilerplate
    const newPage = {
      title: 'Untitled',
      icon: '',
      order: getNextOrder(),
      uid: uid,
      parent: '',
      isDb: false,
    };

    if (parentPage) {
      newPage.parent = parentPage;
      newPage.order = 0; // FIX THIS
    }

    if (isDbRow) {
      newPage.parentDb = parentPage;
    }

    // add to firestore
    const docRef = await addDoc(collection(db, 'pages'), newPage);

    // add blocks subcollection with an empty block?
    // const newBlock = {
    //   uid: uid,
    //   order: 1,
    //   content: JSON.stringify([{type: 'paragraph', children:[{text: ''}]}])
    // };
    // addDoc(collection(db, 'pages', docRef.id, 'blocks'), newBlock);

    return docRef.id;
  }

  const handleSideBarAddPage = async () => {
    // add it
    const newPage = await addPage();
    // redirect
    setNewPage(newPage);
  }

  ///////////////
  // DATABASES //
  ///////////////

  const addDatabase = async (pageID, type = 'table') => {
    // get page in firebase
    const pageRef = doc(db, 'pages', pageID);

    // change page.isDb to true
    updateDoc(pageRef, {isDb: true});

    // construct views and properties
    const views = {
      'defaultView': {
        type: type,
        displayName: type,
        visibleProperties: ['title', 'defaultProp'],
      }
    };
    const properties = {
      'title': {
        displayName: 'Name',
        type: 'title',
      },
      'defaultProp': {
        // fill in based on view type
      },
    };
    // default property by type
    switch (type) {
      case 'list':
      case 'table':
        properties['defaultProp'] = {
          displayName: 'Tags',
          type: 'multiselect',
          selectOptions: {
            // empty
          }
        };
        break;

      case 'gallery':
        properties['defaultProp'] = {
          displayName: 'Tags',
          type: 'multiselect',
          selectOptions: {
            // empty
          }
        };
        views['visibleProperties'] = ['title'];
        views['cardSize'] = 'medium';
        break;

      case 'board':
        properties['defaultProp'] = {
          displayName: 'Status',
          type: 'select',
          selectOptions: {
            notStarted: {
              displayName: 'Not started',
              color: 'red',
              sortOrder: 0,
            },
            inProgress: {
              displayName: 'In progress',
              color: 'yellow',
              sortOrder: 1,
            },
            completed: {
              displayName: 'Completed',
              color: 'green',
              sortOrder: 2,
            },
          }
        };
        views['defaultView']['groupBy'] = 'defaultProp';
        views['cardSize'] = 'medium';
        break;
        
      default: 
        throw new Error(`addDatabase() doesn't know how to handle type ${type}`);
    }

    // add properties map
    updateDoc(pageRef, {
      isDb: true,
      // default properties
      properties: properties,
      // default view
      activeView: 'defaultView',
      views: views,
    });

    // add rows subcollection

    // add three pages
    const rowIDs = [];
    rowIDs.push(await addPage(pageID, true));
    rowIDs.push(await addPage(pageID, true));
    rowIDs.push(await addPage(pageID, true));

    // add row for each new page
    const blankRow = {
      defaultProp: [],
      uid: uid,
    }
    for(const rowID of rowIDs) {
      await setDoc(doc(db, 'pages', pageID, 'rows', rowID), blankRow);
    }
  }

  /////////////
  // SIDEBAR //
  /////////////

  // manage sort order
  const getNextOrder = () => {
    // get max of all page.order values
    const orderVals = pages.map(page => page.order);
    const nextOrder = Math.max(...orderVals) + 1;
    if (nextOrder === -Infinity) { // e.g. if pages is empty
      return 1;
    } else {
      return nextOrder;
    }
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

  ////////////////////
  // PAGE HIERARCHY //
  ////////////////////

  const getSidebarNode = (page) => {
    // recursion!
    const link = (
      <PageLink
        key={ page.id }
        id={ page.id }
        title={ page.title }
        icon={ page.icon }
        draggable={true}

        handleDrag={ handleSideBarPageDrag }
        isDragLeaveReal={ isSideBarPageDragLeaveReal }
        handleDrop={ handleSideBarPageDrop }
      >
        { // find child pages
          pages.filter(
            (otherPage) => otherPage.parent === page.id
          ).map(
            (child) => getSidebarNode(child)
          )
        }
      </PageLink>
    );

    return link;
  }

  const getLineage = (page, partialLineage = []) => {
    // lineage = [great-grandparent, grandparent, parent]
    // for top-level page, lineage = []
    // parent = {id, title, icon}
    if (page.parent === '') {
      return [...partialLineage];
    } else {
      // find parent page
      const parent = pages.find((p) => p.id === page.parent);
      const parentInfo = { id: parent.id, title: parent.title, icon: parent.icon };
      // add to beginning of lineage already assembled
      return getLineage(parent, [parentInfo, ...partialLineage]);
    }
  }

  const findPageUp = (page) => {
    // return either parent page ID or...
    const lineage = getLineage(page);
    if (lineage.length > 0) {
      // last element = direct parent
      // return id
      return lineage[lineage.length - 1].id;
    } else {
      // try routing to first top-level page
      try {
        const firstPageID = pages.filter(p => p.parent === '')[0]['id'];
        return firstPageID;
      } catch (e) {
        // no top-level page
        return 'nopages';
      }
    }
  }

  //////////////
  // DELETING //
  //////////////

  const removePageLinkFromParent = async (pageID) => {
    // find parent
    const child = pages.find(p => p.id === pageID);

    // is there a parent?
    if (child.parent !== '') {
      const parentID = child.parent;

      // go through the blocks
      const blocksRef = collection(db, 'pages', parentID, 'blocks');
      const blocksQuery  = query(blocksRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(blocksQuery);

      querySnapshot.forEach((doc) => { // empty... why?
        // get the JSON string with slateJS nodes
        const content = doc.get('content');
  
        // splice it
        const newContent = splicePageLinkInBlock(content, pageID);
  
        // replace if different
        if (content !== newContent) {
          // update database
          updateDoc(doc.ref, {
            content: newContent,
          });
        }
      });
    }
  }

  const deleteRowFromDatabase = async (pageID) => {
    const child = pages.find(p => p.id === pageID);
    const parentPageID = child.parentDb;

    await deleteDoc(doc(db, 'pages', parentPageID, 'rows', pageID));
  }

  const deletePageFromFirestore = async (pageID) => {
    await deleteDoc(doc(db, 'pages', pageID));
  }

  const deletePageAndSubpages = async (page) => {
    // find subpages
    const children = getDescendents(pages, page);
    const pagesToDelete = [page.id, ...children];

    // remove pagelinks
    for (const id of pagesToDelete) {
      await removePageLinkFromParent(id);
    }

    // delete database row
    if (page.parentDb) {
      await deleteRowFromDatabase(page.id); // need to call this on subpages too?
    }

    // redirect
    setNewPage(findPageUp(page));

    // delete from firestore
    for (const id of pagesToDelete) {
      await deletePageFromFirestore(id);
    }
  }

  ////////////
  // RENDER //
  ////////////

  if (!isSignedIn) {
    return (
      <Login
        createNewEmailUser={createNewEmailUser}
        signInEmailUser={signInEmailUser}
        sendForgottenPasswordEmail={sendForgottenPasswordEmail}
        signInGoogleUser={signInGoogleUser}
        signInAsAnon={signInAsAnon}
      />
    );
  }

  return (
    <Router>
      <div className="App">
        <Sidebar>
          <p>{userDisplayName}'s Clotion</p>
          <button onClick={ signOutUser }>Sign out</button>

          { pages.filter((page) => page.parent === '').map( (page) => getSidebarNode(page)) }
          
          <div className="endSort" >
          </div>

          <button onClick={ handleSideBarAddPage }
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
                <Page
                  id={ page.id }
                  uid={ uid }
                  getLineage={ getLineage }
                  addPage={ addPage }
                  redirect={ setNewPage }
                  deletePage={ () => deletePageAndSubpages(page) }
                  addDatabase={ addDatabase }
                  updateFavicon={updateFavicon}
                  updatePageTitle={updatePageTitle}
                />
              </Route>
            )
          }) }

          <Route path='nopages' exact>
            <p>Click the Add page button to add your first page.</p>
          </Route>
          
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
