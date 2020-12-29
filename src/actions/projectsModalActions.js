import { SWITCH_MODAL_STATE } from '../Constants/newProjectModalConstants';

export function switchModalState(state, mode) {
  return {
    type: SWITCH_MODAL_STATE,
    payload: { status: !state, mode },
  }
}