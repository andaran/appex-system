import * as APPS from '../Constants/appsConstants';

/* develop mode */
const devMode = false;

export function fetchApp(appId) {
  const body = JSON.stringify({ appId });

  let request;
  devMode
    ? request = request = fetch('../testJson/getInstalledApp.json').then(res => res.json())
    : request = fetch('/api/get_app', { method: 'POST', body }).then(res => res.json());

  return {
    type: 'FETCH_APPS',
    payload: request
  }
}

export function changeApps(changedApps) {
  return {
    type: APPS.CHANGE_APPS,
    payload: changedApps
  }
}