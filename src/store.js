import { createStore, combineReducers, applyMiddleware } from 'redux';

import { createPromise } from 'redux-promise-middleware';
import { createLogger } from 'redux-logger'

const middleware = applyMiddleware(createLogger(), createPromise());

const reducers = combineReducers({
    /* reducers here */
});

export default createStore(reducers, middleware);