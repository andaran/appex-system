import { SWITCH_MODAL_STATE } from '../Constants/newProjectModalConstants';

export function switchModalState(state, mode, app) {
  return {
    type: SWITCH_MODAL_STATE,
    payload: { status: !state, mode, app },
  }
}