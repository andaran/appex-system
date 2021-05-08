const main = [
  {
    type: 'CONFIGURATION',
    component: 'MainPage',
  },
  {
    type: 'ALERT',
    title: 'Добро пожаловать в appex!',
    text: 'Рад приветствоавть вас в своей системе. Сейчас вы находитесь на главной странице. Нажмите далее, чтобы перейти на страницу проектов и пройти обучение.',
    code: false,
  },
  {
    type: 'ALERT',
    title: 'Ожидайте ...',
    text: 'Сейчас вас перенаправит на страницу проектов',
    code: "window.location.href = window.location.href.replace('/main', '') + '/projects';",
  }
]

module.exports = main;