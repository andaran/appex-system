
import { FETCH_PROJECTS } from '../Constants/projectsConstants';

export function projectsReducer(state = {
  data: [],
  isFetching: false,
}, action) {
  switch (action.type) {
    case FETCH_PROJECTS: {
      return {...state, data: action.payload};
    }
  }

  return state;
}