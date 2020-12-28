import * as PROJECTS from '../Constants/projectsConstants';
import * as USER from "../Constants/userConstants";

export function projectsReducer(state = {
  data: [],
  isFetching: false,
  error: false,
}, action) {
  switch (action.type) {
    case PROJECTS.FETCH_PROJECTS_PENDING:
      return { ...state, isFetching: true, data: action.payload, error: false };

    case PROJECTS.FETCH_PROJECTS_FULFILLED:
      return { ...state, isFetching: false, data: action.payload, error: false  };

    case PROJECTS.FETCH_PROJECTS_REJECTED:
      return { ...state, isFetching: false, data: action.payload, error: true };

    case PROJECTS.CHANGE_PROJECTS:
      return {...state, data: action.payload};
  }

  return state;
}