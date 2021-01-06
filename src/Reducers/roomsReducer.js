import * as ROOMS from '../Constants/roomsConstants';

export function roomsReducer(state = {
  data: [],
  isFetching: false,
  error: false,
}, action) {
  switch (action.type) {
    case ROOMS.FETCH_ROOMS_PENDING:
      return { ...state, isFetching: true, data: action.payload, error: false };

    case ROOMS.FETCH_ROOMS_FULFILLED:
      return { ...state, isFetching: false, data: action.payload, error: false  };

    case ROOMS.FETCH_ROOMS_REJECTED:
      return { ...state, isFetching: false, data: action.payload, error: true };
  }

  return state;
}