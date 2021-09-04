import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Sidebar from './Sidebar';
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

  return (
    <Router>
      <div className="App">
        <Sidebar pages={ pages } />
        <Switch>
          <Route path="/0/" exact>
            <Page id={ 0 } />
          </Route>
          <Route path="/2/" exact>
            <Page id={ 2 } />
          </Route>
          <Route path="/1/" exact>
            <Page id={ 1 } />
          </Route>

        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
