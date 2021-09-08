import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import Page from './Page';

import { DbContext } from './fakedb';

import './App.css';

function App() {
  const [pages, setPages] = useState([]);

  const db = useContext(DbContext);

  // load pages
  useEffect(() => {
    db.getAllPages()
      .then((allPages) => {
        setPages(allPages);
      })
      .catch((error) => {
        console.error(`Error getting pages: ${error}`);
      });
  }, [db]);

  const updatePages = () => {
    db.getAllPages()
      .then((allPages) => {
        setPages(allPages); // not triggering a re-render. Why?
      })
      .catch((error) => {
        console.error(`Error getting pages: ${error}`);
      });
  }

  /* for debugging */
  const changeTitle = () => {
    db.updateTitle(0, 'New title');
  };
  

  return (
    <Router>
      <div className="App">
        <Sidebar pages={ pages } updatePages={ updatePages }>
          { pages.map( (page) => <SidebarLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } />) }
          <button onClick={ updatePages }>Update pages</button>
          <button onClick={ changeTitle }>Change a title</button>
        </Sidebar>
        <Switch>
          <Route path="/0/" exact>
            <Page id={ 0 } updatePages={ updatePages } />
          </Route>
          <Route path="/2/" exact>
            <Page id={ 2 } updatePages={ updatePages } />
          </Route>
          <Route path="/1/" exact>
            <Page id={ 1 } updatePages={ updatePages } />
          </Route>

        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
