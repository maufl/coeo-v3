import * as React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore, routerReducer, push } from 'react-router-redux'
import { session, LOGIN_SUCCESS } from './state/session';
import { objects, maybeGet } from './state/objects';
import thunkMiddleware from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import App from './layouts/app';
import Login from './views/login';
import About from './views/about';
import Me from './views/me';

let reducers = combineReducers({ session, objects, routing: routerReducer });
let redirectAfterLogin = store => next => action => {
    if (action.type === LOGIN_SUCCESS) {
        store.dispatch(push('/me'))
    }
    return next(action);
}

let logger = store => next => action => {
    console.log("Dispatching ", action);
    let result = next(action);
    console.log("New state is ", store.getState());
    return result;
}

let store = createStore(reducers, applyMiddleware(thunkMiddleware, redirectAfterLogin, logger, routerMiddleware(hashHistory)));
let history = syncHistoryWithStore(hashHistory, store)

export default (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRedirect to="/login" />
                <Route path="login" component={Login} />
                <Route path="about" component={About} />
                <Route path="me" component={Me} onEnter={() => {store.dispatch(maybeGet(store.getState().session.user+'/soc/me'))}}/>
            </Route>
        </Router>
    </Provider>
);