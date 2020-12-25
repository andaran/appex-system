
/* import sockets */
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export function test() {
  socket.emit('test', { name: 'Andrey' });
}