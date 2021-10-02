import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { useHistory } from 'react-router';

import Sidebar from './Sidebar';
import PageLink from './PageLink';
import Page from './Page';

import { rearrange } from './helpers';

// import { DbContext } from './firebase';
import { db } from './firebase/db';

import { onSnapshot, collection, addDoc, orderBy, query, writeBatch, doc } from "firebase/firestore";


import './App.css';

function App() {
  // state
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState('');
  const [dragFromId, setDragFromId] = useState('');

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

  // manage sort order
  const getNextOrder = () => {
    // get max of all page.order values
    const orderVals = pages.map(page => page.order);
    return Math.max(...orderVals) + 1;
  }
  // dragging
  const handleSideBarPageDrag = (pageId) => {
    setDragFromId(pageId);
  }
  // dropping
  const handleSideBarPageDrop = (beforeId) => {
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

  return (
    <Router>
      <div className="App">
        <Sidebar>
          { pages.map( (page) => <PageLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } handleDrag={ handleSideBarPageDrag } handleDrop={ handleSideBarPageDrop } />) }
          <button onClick={ addPage }>Add page</button>
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
