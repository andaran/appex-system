export function fetchUser() {
  return {
    type: 'FETCH_USER',
    payload: fetch('/api/get_user', { method: 'POST' }).then(res => res.json()),
  }
}