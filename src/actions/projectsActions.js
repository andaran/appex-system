import * as PROJECTS from '../Constants/projectsConstants';

const projects = [
  {
    title: "макароно-варка",
    icon: "faUtensils",
    color: "#f1c40f",
    id: "hGud&snkxkhs&6467",
    code: {
      html: '<div class="varka"> \n' +
        '\t[[Button \n' +
        '      size="md"\n' +
        '      text="кнопка 1"\n' +
        '      id="btn"\n' +
        '      background="#1abc9c"\n' +
        '    ]]\n' +
        '    [[Switch\n' +
        '      id="switch"\n' +
        '      background="#1abc9c"\n' +
        '    ]]\n' +
        '</div>',
      css: '',
      js: 'console.log(\'Hello, World!\');',
    },
    releaseCode: {
      html: 'release!',
      css: '',
      js: 'console.log(\'Release!\');',
    },
  },
  {
    title: "Автополив",
    icon: "faTint",
    color: "#3498db",
    id: "hGud&snkxkhs&6468",
    code: {
      html: '<div class="varka"> \n' +
        '\t[[Button \n' +
        '      size="md"\n' +
        '      text="кнопка 1"\n' +
        '      id="btn"\n' +
        '      background="#1abc9c"\n' +
        '    ]]\n' +
        '    [[Switch\n' +
        '      id="switch"\n' +
        '      background="#1abc9c"\n' +
        '    ]]\n' +
        '</div>',
      css: '',
      js: 'console.log(\'Hello, World!\');',
    },
    releaseCode: {
      html: 'release!',
      css: '',
      js: 'console.log(\'Release!\');',
    },
  },
];

/* develop mode */
const devMode = true;

export function fetchProjects(username, id) {
  const body = JSON.stringify({ username, id });

  let request;
  devMode
    ? request = new Promise((resolve, reject) => { resolve(projects) })
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