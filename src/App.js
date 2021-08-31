import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Sidebar from './Sidebar';
import Page from './Page';

import './App.css';

const DUMMY_PAGES = [
  {title: 'Page 1', icon: '😬', content: 'blah blah blah', id: 0},
  {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah', id: 1},
  {title: 'Page 3', icon: '🥳', content: 'blah blah blah', id: 2},
];

function App() {
  const [pages, setPages] = useState(DUMMY_PAGES);

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
