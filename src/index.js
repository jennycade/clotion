import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import dataHandler, { DbContext } from './fakedb';

ReactDOM.render(
  <DbContext.Provider value={ dataHandler() }>
    <App />
  </DbContext.Provider>,
  document.getElementById('root')
);
