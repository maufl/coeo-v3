import * as React from 'react';
import * as ReactDOM from 'react-dom';
import routes from './routes';

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(routes, document.getElementById('container'));
});