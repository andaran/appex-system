
/* develop mode */
const devMode = false;

let request;
devMode
  ? request = fetch('../testJson/user.json').then(res => res.json())
  : request = fetch('/api/get_user', { method: 'POST' }).then(res => res.json());

export function fetchUser() {
  return {
    type: 'FETCH_USER',
    payload: request,
  }
}