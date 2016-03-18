import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import Login from './views/login';
import About from './views/about';

var router = <Router history={hashHistory}>
               <Route path="/" component={Login} />
               <Route path="/about" component={About} />
             </Router>;

import { AppBar } from 'material-ui';

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(router, document.getElementById('container'));
});