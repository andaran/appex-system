
/*   ---==== Appex server ====---   */

const express = require("express");
const socketIo = require("socket.io");
const path = require("path");
const jwt = require('jsonwebtoken');

const app = express();

/* set static dir */
app.use(express.static(path.join(__dirname, 'build')));

/* start the server! */
const server = app.listen(3001, (err) => {
  err ? console.error(err) : console.log('[+] Сервер поднят!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



/* sockets */
const io = socketIo(server);
io.on('connection', (socket) => {
  socket.on('test', data => {
    console.log('CONNECT: ', data);
  });
});

