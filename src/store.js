import { createStore, combineReducers, applyMiddleware } from 'redux';

import { createPromise } from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';

/*   ---==== Reducers ====---   */

import { projectsReducer } from './Reducers/projectsReducer';
import { projectsModalReducer } from "./Reducers/projectsModalReducer";
import { userReducer } from './Reducers/userReducer';

/*   --=== End reducers ===--   */

const middleware = applyMiddleware(createLogger(), createPromise());

const reducers = combineReducers({

    /* reducers here */
    projects: projectsReducer,
    projectsModal: projectsModalReducer,
    userData: userReducer,
});

export default createStore(reducers, middleware);