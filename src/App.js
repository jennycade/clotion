import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import Page from './Page';

// import { DbContext } from './firebase';
import { db } from './firebase/db';

import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";


import './App.css';

function App() {
  const [pages, setPages] = useState([]);
  const [redirectPage, setRedirectPage] = useState('');

  // load pages
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pages'), (pagesSnapshot) => {
      const newPages = [];
      pagesSnapshot.forEach((doc) => {
        const newPage = {id: doc.id, ...doc.data()}
        newPages.push(newPage);
      });
      setPages(newPages);
  });
    return unsub;
  }, []);

  const addPage = async () => {
    const newPage = {
      title: 'Untitled',
      icon: '',
      content: '',
    };

    const docRef = await addDoc(collection(db, 'pages'), newPage);
    setRedirectPage(docRef.id);
  }

  return (
    <Router>
      <div className="App">
        <Sidebar>
          { pages.map( (page) => <SidebarLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } />) }
          <button onClick={ addPage }>Add page</button>
        </Sidebar>
        <Switch>
          { pages.map((page) => {
            return (
              <Route path={ `/${page.id}/` } exact>
                <Page id={ page.id } />
              </Route>
            )
          }) }
          { redirectPage !== '' && 
            <Redirect to={`/${ redirectPage }/`} />
          }
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
