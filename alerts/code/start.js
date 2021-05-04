const start = [
  {
    type: 'CONFIGURATION',
    component: 'ProjectsWrap',
  },
  {
    type: 'ALERT',
    title: 'Добро пожаловать в appex!',
    text: 'Рад приветствоавть вас в своей системе. Пройдите обучение, чтобы лучше разбираться в ней',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'С помощью этой кнопки можно создать новое приложение',
    target: '#project-card__plus',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'Нажав сюда, вы создадите новую комнату',
    target: '#room-card__plus',
    code: false,
  },
  {
    type: 'ALERT',
    title: 'Приятного программирования!',
    text: 'Теперь вы умеете пользоваться этим меню',
    code: false,
  },
]

module.exports = start;