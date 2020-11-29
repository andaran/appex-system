import { SAVE_CODE } from '../Constants/saveCodeConstants';

export function saveCode(code, id) {
  return {
    type: SAVE_CODE,
    payload: { code, id },
  }
}