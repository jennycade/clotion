import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import Page from './Page';

// import { DbContext } from './firebase';
import { db } from './firebase/db';

import { doc, onSnapshot, collection } from "firebase/firestore";


import './App.css';

function App() {
  const [pages, setPages] = useState([]);

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

  return (
    <Router>
      <div className="App">
        <Sidebar>
          { pages.map( (page) => <SidebarLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } />) }
        </Sidebar>
        <Switch>
          { pages.map((page) => {
            return (
              <Route path={ `/${page.id}/` } exact>
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
