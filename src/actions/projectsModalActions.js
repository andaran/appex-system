import { SWITCH_MODAL_STATE } from '../Constants/newProjectModalConstants';

export function switchModalState(state) {
  return {
    type: SWITCH_MODAL_STATE,
    payload: !state
  }
}