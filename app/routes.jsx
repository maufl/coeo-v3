import * as React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore, routerReducer, push } from 'react-router-redux'
import store from './store';

import App from './layouts/app';
import LoginPage from './views/login_page';
import SignupPage from './views/signup_page';
import AboutPage from './views/about_page';
import MePage from './views/me_page';

let history = syncHistoryWithStore(hashHistory, store);

export default (
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRedirect to="/login" />
            <Route path="login" component={LoginPage} />
            <Route path="signup" component={SignupPage} />
            <Route path="about" component={AboutPage} />
            <Route path="me" component={MePage} />
        </Route>
    </Router>
);