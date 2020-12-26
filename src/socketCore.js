
/* import sockets */
import io from 'socket.io-client';

const port = +process.env.port || 3000;
const socket = io(`http://localhost:${ port }`);

export function test() {
  socket.emit('test', { name: 'Andrey' });
}