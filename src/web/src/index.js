import React from 'react';
import { render } from 'react-dom'

import App from './components/App';

console.log('UPDATE....')

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
