import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { useHistory } from 'react-router';

import Sidebar from './Sidebar';
import PageLink from './PageLink';
import Page from './Page';

// import { DbContext } from './firebase';
import { db } from './firebase/db';

import { onSnapshot, collection, addDoc, orderBy, query } from "firebase/firestore";


import './App.css';

function App() {
  // state
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState('');

  // load pages
  useEffect(() => {
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
    };

    // add to firestore
    const docRef = await addDoc(collection(db, 'pages'), newPage);
    setNewPage(docRef.id);

  }

  return (
    <Router>
      <div className="App">
        <Sidebar>
          { pages.map( (page) => <PageLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } />) }
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
