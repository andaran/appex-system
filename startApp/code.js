
/* начальное состояние */
App.state = {
  status: false,
}

/* настройки */
App.settings = {
  awaitResponse: true,
}

/* ищем кнопку и фон */
const button = document.getElementById('app-button');
const wrap = document.getElementById('app-button-wrap');

/* вешаем слушатели событий */
button.addEventListener('click', () => {
  App.send({ status: !App.state.status });
  window.navigator.vibrate(40);
});

/* обновление состояния */
App.on('update', state => {
  if (state.status) {
    button.style.color = '#00d2d3';
    wrap.style.backgroundColor = '#00d2d3';
  } else {
    button.style.color = '#c8d6e5';
    wrap.style.backgroundColor = '#c8d6e5';
  }
});

/* запускаем приложение */
App.start();
