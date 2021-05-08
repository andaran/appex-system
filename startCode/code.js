
/* начальное состояние */
App.state = {
    status: false,
}

/* настройки */
App.settings = {
    awaitResponse: true,
}

/* обновление состояния */
App.on('update', state => {
    // Ваш код здесь
});

/* ошибка */
App.on('error', error => {
    // Ваш код здесь
});

/* запускаем приложение */
App.start();
