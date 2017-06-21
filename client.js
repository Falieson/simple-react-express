import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'

function AppRoot(){
  return (
    <App>
      A test 
    </App>
  )
}

ReactDOM.render(
  <AppRoot />,
  document.getElementById('root')
);