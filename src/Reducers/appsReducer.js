import * as APPS from '../Constants/appsConstants';

export function appsReducer(state = {
  data: [],
  isFetching: false,
  error: false,
  fulfilled: false,
}, action) {
  switch (action.type) {
    case APPS.FETCH_APPS_PENDING:
      return { ...state, isFetching: true, error: false, fulfilled: false };

    case APPS.FETCH_APPS_FULFILLED:
      return { ...state, isFetching: false, data: [...state.data, action.payload], error: false, fulfilled: true };

    case APPS.FETCH_APPS_REJECTED:
      return { ...state, isFetching: false, data: action.payload, error: true };

    case APPS.CHANGE_APPS:
      return {...state, data: action.payload};
  }

  return state;
}