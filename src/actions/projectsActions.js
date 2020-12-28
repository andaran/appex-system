import * as Projects from '../Constants/projectsConstants';

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

export function fetchProjects(username, id) {
  const body = JSON.stringify({ username, id });
  return {
    type: 'FETCH_PROJECTS',
    payload: fetch('/api/get_projects', {
      method: 'POST', body
    }).then(res => res.json()),
  }
}

export function changeProjects(changedProjects) {
  return {
    type: Projects.CHANGE_PROJECTS,
    payload: changedProjects
  }
}