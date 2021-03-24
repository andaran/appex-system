
/* начальное состояние */
let state = {
    isOnline: false,
}

/* настройки */
const settings = {
    awaitResponse: true,
}

/* обновление состояния */
const update = (newState) => {
    state = newState;
}

App.settings = settings;
App.state = state;
App.update = update;
App.start();
