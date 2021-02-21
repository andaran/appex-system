import * as APP from '../Constants/appStateConstants';

export function appStateReducer(state = {
  state: 'closed',
  id: '',
  type: 'my',
}, action) {
  switch (action.type) {
    case APP.CHANGE_APP_STATE:
      return { ...state, ...action.payload };
  }

  return state;
}