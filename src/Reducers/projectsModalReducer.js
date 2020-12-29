import { SWITCH_MODAL_STATE } from '../Constants/newProjectModalConstants';

export function projectsModalReducer(state = {
  id: '',
  status: false,
  mode: 'new',
  app: {},
}, action) {
  switch (action.type) {
    case SWITCH_MODAL_STATE:
      return { ...state, status: action.payload.status, mode: action.payload.mode, app: action.payload.app };
  }

  return state;
}