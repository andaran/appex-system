import * as APP from '../Constants/appStateConstants';

export function changeAppState(changedState) {
  return {
    type: APP.CHANGE_APP_STATE,
    payload: changedState
  }
}