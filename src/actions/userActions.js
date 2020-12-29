
/* develop mode */
const devMode = false;

let request;
devMode
  ? request = fetch('../testJson/user.json').then(res => res.json())
  : request = fetch('/api/get_user', { method: 'POST', cache: 'no-store' }).then(res => res.json());

export function fetchUser() {
  console.log('USER', request);

  return {
    type: 'FETCH_USER',
    payload: fetch('/api/get_user', { method: 'POST', cache: 'no-store' }).then(res => res.json()),
  }
}