const project = [
  {
    type: 'CONFIGURATION',
    component: 'ProjectPage',
    name: 'project',
  },
  {
    type: 'ALERT',
    title: 'Редактор кода',
    text: 'Перед Вами код Вашего первого приложения!',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'В настройках приложения можно поменять его название, иконку и возможность скачивать',
    target: '#app-navbar__settings',
    code: false,
  },
  {
    type: 'POP_UP',
    text: 'В этом меню можно подключить приложение к комнате для его тестирования',
    target: '.app-navbar__item-connect',
    code: false,
  },
  {
    type: 'ALERT',
    title: 'Сочетания клавиш',
    text: 'С помощью сочетаний клавишь можно выполнять различные действия:<br><br>При сохранении код отправляется на сервер appex, а затем перезагружаются все эмуляторы, на которых запущено приложение. Подробнее об эмуляторах можно почитать в документации.<br><br>При выполнении бекапа код приложения сохраняется в локальной памяти браузера. Сохранить можно только один бекап. После восстановления приложения из бекапа необходимо сохранить код, чтобы он улетел на сервер.<br><br>На Вашем эмуляторе выполняется текущий код приложения, а на устройствах пользователей код последнего релиза. Комбинация Alt + R создаст релиз, а затем сохранит его.<br><br>В данный момент все редактры кода показываются на одном экране. При смене вида они станут больше, переключаться можно стрелками.<br><br>Чтобы не мешались вкладки и прочие элементы браузера, можно открыть сайт во весь экран.',
    code: false,
  },
  {
    type: 'ALERT',
    title: 'Теперь познакомимся с эмулятором',
    text: 'На нем в реальном времени отображаются все изменения в коде после сохранения.',
    code: `
    const emu = document.querySelector('#app-demo');
    emu.classList.add('app-demo-position-true');
    emu.classList.remove('app-demo-position-false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'Как Вы могли заметить, изначально он скрывался внизу. Показывается эмулятор только при наведении на него мышкой. С помощью данной кнопки можно зафиксировать эмулятор в открытом положении',
    target: '.app-demo__nav div:nth-child(1)',
    code: `
    const emu = document.querySelector('.app-demo__nav div:nth-child(1)');
    emu.classList.add('app-demo__nav-item_true');
    emu.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'С помощью этой кнопки можно передвигать эмулятор',
    target: '.app-demo__nav div:nth-child(2)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav div:nth-child(1)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav div:nth-child(2)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'С помощью этой кнопки можно менять размер эмулятора',
    target: '.app-demo__nav div:nth-child(4)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav div:nth-child(2)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav div:nth-child(4)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'Этой кнопкой можно зафиксировать текущий размер эмулятора',
    target: '.app-demo__nav div:nth-child(3)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav div:nth-child(4)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav div:nth-child(3)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'Эта кнопка открывает эмулятор во весь экран',
    target: '.app-demo__nav div:nth-child(5)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav div:nth-child(3)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav div:nth-child(5)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'С помощью этой кнопки можно открыть приложение в отдельном окне',
    target: '.app-demo__nav .app-demo__nav-item:nth-child(6)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav .app-demo__nav-item:nth-child(5)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav .app-demo__nav-item:nth-child(6)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'POP_UP',
    text: 'Данная кнопка перезагружает эмулятор',
    target: '.app-demo__nav .app-demo__nav-item:nth-child(7)',
    code: `
    const emu1 = document.querySelector('.app-demo__nav .app-demo__nav-item:nth-child(6)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    
    const emu2 = document.querySelector('.app-demo__nav .app-demo__nav-item:nth-child(7)');
    emu2.classList.add('app-demo__nav-item_true');
    emu2.classList.remove('app-demo__nav-item_false');
    `,
  },
  {
    type: 'ALERT',
    title: 'Вы прошли обучение',
    text: 'Приятного написания кода!',
    code: `
    const emu1 = document.querySelector('.app-demo__nav .app-demo__nav-item:nth-child(7)');
    emu1.classList.add('app-demo__nav-item_false');
    emu1.classList.remove('app-demo__nav-item_true');
    `,
  },
]

module.exports = project;