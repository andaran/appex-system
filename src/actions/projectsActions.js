import * as PROJECTS from '../Constants/projectsConstants';

/* develop mode */
const devMode = false;

export function fetchProjects(username, id) {
  const body = JSON.stringify({ username, id });

  let request;
  devMode
    ? request = request = fetch('../testJson/projects.json').then(res => res.json())
    : request = fetch('/api/get_projects', { method: 'POST', body }).then(res => res.json());

  return {
    type: 'FETCH_PROJECTS',
    payload: request,
  }
}

export function changeProjects(changedProjects) {
  return {
    type: PROJECTS.CHANGE_PROJECTS,
    payload: changedProjects
  }
}