
/* develop mode */
const devMode = true;

export function fetchRooms() {
  let request;
  devMode
    ? request = fetch('../testJson/rooms.json').then(res => res.json())
    : request = fetch('/api/get_rooms', { method: 'POST' }).then(res => res.json());

  return {
    type: 'FETCH_ROOMS',
    payload: request,
  }
}