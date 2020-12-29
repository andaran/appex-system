import * as USER from '../Constants/userConstants';
import { cloneDeep } from 'lodash';

export function userReducer(state = {
  user: false,
  status: 'loading',
  isFetching: false,
  err: false,
}, action) {
  switch (action.type) {
    case USER.FETCH_USER_PENDING:
      return cloneDeep({ ...state, isFetching: true });

    case USER.FETCH_USER_FULFILLED:
      return cloneDeep({ ...state, isFetching: false, ...action.payload  });

    case USER.FETCH_USER_REJECTED:
      return cloneDeep({ ...state, isFetching: false, error: true });
  }

  return state;
}