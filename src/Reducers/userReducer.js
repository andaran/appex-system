import * as USER from '../Constants/userConstants';

export function userReducer(state = {
  user: false,
  status: 'loading',
  isFetching: false,
  err: false,
}, action) {
  switch (action.type) {
    case USER.FETCH_USER_PENDING:
      return { ...state, isFetching: true };

    case USER.FETCH_USER_FULFILLED:
      return { ...state, isFetching: false, ...action.payload  };

    case USER.FETCH_USER_REJECTED:
      return { ...state, isFetching: false, error: true };
  }

  return state;
}