
/* import sockets */
import io from 'socket.io-client';

const port = +process.env.port || 3001;
const socket = io(`http://localhost:${ port }`);

export function test() {
  socket.emit('test', { name: 'Andrey' });
}

const rooms = new Set();

class App {
  constructor() {
    // this.app = app;
    // this.roomSettings = roomSettings;

    this.state = false;
    this.update = false;
    this.roomId = false;
    this.roomPass = false;
    this.settings = {};

    this.socket = socket;

  }

  /* get app object */
  getApp() { return this.app; }

  /* start app */
  start() {

    const socket = this.socket;
    const id = this.app.id;
    const roomId = this.roomSettings.body.roomId;
    const roomPass = this.roomSettings.body.roomPass;

    console.log('[log] Старт приложения ...');

    /* check params */
    if (!this.state) { return console.log('[Err] Отсутствует state!'); }
    if (!this.update) { return console.log('[Err] Отсутствует update!'); }
    if (this.roomSettings === undefined) { return console.log('[Err] Отсутствуют данные комнаты!'); }

    /* change settings */
    const defaultSettings = {
      awaitResponse: true,
    }
    this.settings = { ...defaultSettings, ...this.settings };

    /* connect to room */
    // socket.emit('disconnectFromRoom', { roomId });
    socket.emit('connectToRoom', { roomId, roomPass });
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
      this.state = { ...this.state, ...state };
      console.log('[log] Приложение подключено!');
      this.update( this.state );
    });

    /* update */
    socket.on('updateState', state => {

      /* update if id is true */
      if (state.roomId === this.roomSettings.body.roomId) {
        this.state = { ...this.state, ...state.params };
        this.update( this.state );
        console.log('[log] Обновление состояния ...');
      }
    });

    /* error */
    socket.on('connectError', err => {
      console.log('[Err] Ошибка подключения!');
    });

    socket.on('connectErrRoomNotFound', err => {
      console.log('[Err] Неверный id или пароль комнаты!');
    });
  }
}

let app = new App();
app.init();

export { app };