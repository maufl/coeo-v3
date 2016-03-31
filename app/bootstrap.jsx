import * as React from 'react';
import * as ReactDOM from 'react-dom';
import routes from './routes';
import { session } from './redux/session';
var redux = require('redux');
var reactRedux = require('react-redux');

var reducers = redux.combineReducers({ session });

let store = redux.createStore(reducers);
let Provider = reactRedux.Provider;

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(<Provider store={store}>{routes}</Provider>, document.getElementById('container'));
});
