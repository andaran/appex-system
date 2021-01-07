
/* import sockets */
import io from 'socket.io-client';

const port = +process.env.port || 3000;
const socket = io(`http://localhost:${ port }`);

export function test() {
  socket.emit('test', { name: 'Andrey' });
}


export default class App {
  constructor(app, roomSettings) {
    this.app = app;
    this.roomSettings = roomSettings;

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

    /* connect to room */
    socket.emit('connectToRoom', { roomId, roomPass });

    socket.on('connectSuccess', state => {
      this.state = { ...this.state, ...state };
      console.log('[log] Приложение подключено!');
      this.update();
    });

    socket.on('updateState', params => {
      this.state = { ...this.state, ...params };
      console.log('[log] Обновление состояния ...');
      this.update();
    })
  }

  send(params) {
    this.socket.emit('updateState', params);
    console.log('[log] Отправка параметров ...');
  }
}