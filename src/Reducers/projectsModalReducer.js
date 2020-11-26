import { SWITCH_MODAL_STATE } from '../Constants/newProjectModalConstants';

export function projectsModalReducer(state = {
  id: '',
  status: false,
}, action) {
  switch (action.type) {
    case SWITCH_MODAL_STATE: {
      return {...state, status: action.payload};
    }
  }

  return state;
}