import { FETCH_PROJECTS, CHANGE_PROJECTS } from '../Constants/projectsConstants';

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
  },
];

export function fetchProjects() {
  return {
    type: FETCH_PROJECTS,
    payload: projects
  }
}

export function changeProjects(changedProjects) {
  return {
    type: CHANGE_PROJECTS,
    payload: changedProjects
  }
}