
/* import sockets */
import io from 'socket.io-client';
import EventEmitter from 'events';

const port = 3001;
const socket = io();

export function connectToDevRoom(roomId) {
  socket.emit('connectToDevRoom', { roomId: 'dev=' + roomId });
}

export function updateAppCode(roomId) {
  socket.emit('updateAppCode', { roomId: 'dev=' + roomId });
}

export { socket };

export class App extends EventEmitter {

  /* private fields */
  #app;

  constructor(app, roomSettings) {

    super();

    this.#app = app;
    this.roomSettings = roomSettings;

    this.state = false;
    this.update = false;
    this.error = false;
    this.roomId = false;
    this.roomPass = false;
    this.settings = {};

    this.socket = socket;

    // bind
    this.init = this.init.bind(this);
    this.send = this.send.bind(this);
    this.start = this.start.bind(this);
  }

  /* get app object */
  get app() { return this.#app; }

  /* start app */
  start() {

    /* check params */
    if (!this.state) { return console.log('[Err] Отсутствует state!'); }
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
    socket.emit('connectToRoom', { roomId, roomPass, currentState: this.state });
  }

  send(params) {

    const roomId = this.roomSettings.body.roomId;
    const roomPass = this.roomSettings.body.roomPass;

    this.socket.emit('updateState', { roomId, roomPass, params });
    console.log('[log] Отправка параметров ...');

    if (!this.settings.awaitResponse) {
      this.state = { ...this.state, ...params };
      this.update ? this.update(this.state) : this.emit('update', this.state);
      console.log('[log] Обновление состояния ...');
    }
  }

  invertProperty(property, room = false) {

    const roomId = room ? room.roomId : this.roomSettings.body.roomId;
    const roomPass = room ? room.roomPass : this.roomSettings.body.roomPass;

    this.socket.emit('invertProperty', { roomId, roomPass, property });
    console.log('[log] Отправка параметров ...');
  }

  changeNumericProperty(property, value, room = false) {

    const roomId = room ? room.roomId : this.roomSettings.body.roomId;
    const roomPass = room ? room.roomPass : this.roomSettings.body.roomPass;

    this.socket.emit('changeNumericProperty', { roomId, roomPass, property, value });
    console.log('[log] Отправка параметров ...');
  }

  init() {

    /* init app */
    socket.on('connectSuccess', state => {
      this.state = { ...this.state, ...state };
      this.update ? this.update(this.state) : this.emit('update', this.state);
      console.log('[log] Приложение подключено!');

      /* ping test */
      this.testPingTime = Date.now();
      this.socket.emit('ping', {});
    });

    /* update */
    socket.on('updateState', state => {

      /* update if id is true */
      if (state.roomId === this.roomSettings.body.roomId) {
        this.state = { ...this.state, ...state.params };
        this.update ? this.update(this.state) : this.emit('update', this.state);
        console.log('[log] Обновление состояния ...');
      }
    });

    /* error */
    socket.on('err', err => {
      this.error ? this.error(err) : this.emit('err', err);
      console.log(`[Err] ${ err.type }`);
    });

    /* ping test */
    socket.on('ping', () => {
      const pingTime = Date.now() - this.testPingTime;
      console.log(`[log] Пинг: ${ pingTime }мс.`);
    });
  }
}
