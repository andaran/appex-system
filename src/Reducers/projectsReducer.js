import * as PROJECTS from '../Constants/projectsConstants';

export function projectsReducer(state = {
  data: [],
  isFetching: false,
  error: false,
  fulfilled: false,
}, action) {
  switch (action.type) {
    case PROJECTS.FETCH_PROJECTS_PENDING:
      return { ...state, isFetching: true, error: false, fulfilled: false };

    case PROJECTS.FETCH_PROJECTS_FULFILLED:
      return { ...state, isFetching: false, data: action.payload, error: false, fulfilled: true };

    case PROJECTS.FETCH_PROJECTS_REJECTED:
      return { ...state, isFetching: false, data: action.payload, error: true };

    case PROJECTS.CHANGE_PROJECTS:
      return {...state, data: action.payload};
  }

  return state;
}