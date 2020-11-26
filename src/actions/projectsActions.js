import { FETCH_PROJECTS } from '../Constants/projectsConstants';

const projects = [
  {
    title: "макароно-варка",
    icon: "faUtensils",
    color: "#f1c40f",
    id: "hGud&snkxkhs&6467"
  },
  {
    title: "Автополив",
    icon: "faTint",
    color: "#3498db",
    id: "hGud&snkxkhs&6468"
  },
  {
    title: "Цветочек",
    icon: "faFan",
    color: "#2ecc71",
    id: "hGud&snkxkhs&6469"
  },
  {
    title: "Штора",
    icon: "faBolt",
    color: "#1abc9c",
    id: "hGud&snkxkhs&6470"
  },
  {
    title: "Свет",
    icon: "faLightbulb",
    color: "#e67e22",
    id: "hGud&snkxkhs&6471"
  },
  {
    title: "Сигнализация",
    icon: "faExclamation",
    color: "#e74c3c",
    id: "hGud&snkxkhs&6472"
  }
];

export function fetchProjects() {
  return {
    type: FETCH_PROJECTS,
    payload: projects
  }
}