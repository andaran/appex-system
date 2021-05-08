const start = [
  {
    type: 'CONFIGURATION',
    component: 'ProjectsWrap',
    name: 'start',
  },
  {
    type: 'ALERT',
    title: 'Проекты',
    text: 'Перед вами страница проектов. Жмите далее, чтобы проходить обучение.',
    code: `
    const body = JSON.stringify({ name: 'main' });
    fetch('/api/remove_alerts_chains', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    });
    `,
  },
  {
    type: 'POP_UP',
    text: 'Это Ваше первое приложение. Если нажать на него, откроется редактор кода.',
    target: '.project-card__icon',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'С помощью этой кнопки можно создать еще одно приложение',
    target: '#project-card__plus',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'А это карточка комнаты. Подробнее о комнатах можно прочитать в документации',
    target: '.room-card',
    code: `
    document.documentElement.scrollTop = 
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.querySelector('.room-card .icons').style.position = 'absolute';
    `,
  },
  {
    type: 'POP_UP',
    text: 'Вы можете поменять имя и пароль комнаты, сохранить или удалить её с помощью этих кнопок',
    target: '.room-card .icons',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'Нажав сюда, вы создадите новую комнату',
    target: '#room-card__plus',
    code: `document.documentElement.scrollTop = 
           document.documentElement.scrollHeight - document.documentElement.clientHeight`,
  },
  {
    type: 'ALERT',
    title: 'Продолжение обучения',
    text: 'Теперь откройте имеющееся или создайте новое приложение.',
    code: false,
  },
]

module.exports = start;