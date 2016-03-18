import * as React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import App from './layouts/app';
import Login from './views/login';
import About from './views/about';

export default <Router history={hashHistory}>
                 <Route path="/" component={App}>
                   <IndexRedirect to="/login" />
                   <Route path="login" component={Login} />
                   <Route path="about" component={About} />
                 </Route>
               </Router>;