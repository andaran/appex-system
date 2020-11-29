import { FETCH_PROJECTS } from '../Constants/projectsConstants';

const projects = [
  {
    title: "макароно-варка",
    icon: "faUtensils",
    color: "#f1c40f",
    id: "hGud&snkxkhs&6467",
    code: {
      html: '<div class="varka"> </div>',
      css: '.varka {\n    background: orange;\n}',
      js: 'console.log(\'Hello, World!\');',
    },
  },
  {
    title: "Автополив",
    icon: "faTint",
    color: "#3498db",
    id: "hGud&snkxkhs&6468",
    code: {
      html: '<div class="varka"> </div>',
      css: '.varka {\n    background: orange;\n}',
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