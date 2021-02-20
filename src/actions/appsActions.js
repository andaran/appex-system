import * as APPS from '../Constants/appsConstants';

/* develop mode */
const devMode = true;

export function fetchApp(appId) {
  const body = JSON.stringify({ appId });

  let request;
  devMode
    ? request = request = fetch('../testJson/getInstalledApp.json').then(res => res.json())
    : request = fetch('/api/get_projects', { method: 'POST', body }).then(res => res.json());

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