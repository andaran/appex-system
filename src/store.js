import { createStore, combineReducers, applyMiddleware } from 'redux';

import { createPromise } from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';

/*   ---==== Reducers ====---   */

import { projectsReducer } from './Reducers/projectsReducer';
import { projectsModalReducer } from "./Reducers/projectsModalReducer";
import { userReducer } from './Reducers/userReducer';
import { roomsReducer } from './Reducers/roomsReducer';

/*   --=== End reducers ===--   */

const middleware = applyMiddleware(createLogger(), createPromise());

const reducers = combineReducers({

    /* reducers here */
    projects: projectsReducer,
    projectsModal: projectsModalReducer,
    userData: userReducer,
    rooms: roomsReducer,
});

export default createStore(reducers, middleware);