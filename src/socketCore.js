
/* import sockets */
import io from 'socket.io-client';

const port = 3001;
const socket = io(`http://192.168.1.35:${ port }`);

export function connectToDevRoom(roomId) {
  socket.emit('connectToDevRoom', { roomId: 'dev=' + roomId });
}

export function updateAppCode(roomId) {
  socket.emit('updateAppCode', { roomId: 'dev=' + roomId });
}

export { socket };

export class App {
  constructor(app, roomSettings) {

    this.app = app;
    this.roomSettings = roomSettings;

    this.state = false;
    this.update = false;
    this.roomId = false;
    this.roomPass = false;
    this.settings = {};
    this.runFlag = false;

    this.socket = socket;

  }

  /* get app object */
  getApp() { return this.app; }

  /* start app */
  start() {

    /* check params */
    if (!this.state) { return console.log('[Err] Отсутствует state!'); }
    if (!this.update) { return console.log('[Err] Отсутствует update!'); }
    if (!this.roomSettings) { return console.log('[Err] Отсутствуют данные комнаты!'); }

    const socket = this.socket;
    const roomId = this.roomSettings.body.roomId;
    const roomPass = this.roomSettings.body.roomPass;

    console.log('[log] Старт приложения ...');

    /* change settings */
    const defaultSettings = {
      awaitResponse: true,
    }
    this.settings = { ...defaultSettings, ...this.settings };

    /* connect to room */
    // socket.emit('disconnectFromRoom', { roomId });
    socket.emit('connectToRoom', { roomId, roomPass, currentState: this.state });
    this.runFlag = true;
  }

  send(params) {

    const roomId = this.roomSettings.body.roomId;
    const roomPass = this.roomSettings.body.roomPass;

    this.socket.emit('updateState', { roomId, roomPass, params });
    console.log('[log] Отправка параметров ...');

    if (!this.settings.awaitResponse) {
      this.state = { ...this.state, ...params };
      console.log('[log] Обновление состояния ...');
      this.update( this.state );
    }
  }

  init() {

    /* init app */
    socket.on('connectSuccess', state => {
      if (!this.runFlag) { return; }
      this.state = { ...this.state, ...state };
      console.log('[log] Приложение подключено!');
      this.update( this.state );
    });

    /* update */
    socket.on('updateState', state => {
      if (!this.runFlag) { return; }

      /* update if id is true */
      if (state.roomId === this.roomSettings.body.roomId) {
        this.state = { ...this.state, ...state.params };
        this.update( this.state );
        console.log('[log] Обновление состояния ...');
      }
    });

    /* error */
    socket.on('error', err => {
      if (!this.runFlag) { return; }
      switch (err.type) {
        case 'RoomNotFound':
          console.log('[Err] Неверный id или пароль комнаты!');
          break;
        case 'UnknownError':
          console.log('[Err] Ошибка подключения!');
          break;
        default:
          console.log(`[Err] ${ err.type }`);
          break;
      }
    });
  }

  exit() {
    try {
      this.runFlag = false;
      if (this.roomSettings !== undefined) {
        const roomId = this.roomSettings.body.roomId;
        this.socket.emit('disconnectFromRoom', { roomId });
      }
      console.log('[Log] Выход из приложения.');
    } catch(err) {
      console.log('[Err] Ошибка выхода из приложения!\n\n', err);
    }
  }
}
