
/*   ---==== Appex server ====---   */

const express = require("express");
const socketIo = require("socket.io");
const path = require("path");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('cookie-session');

/* settings */
const sessionSecretKey1 = process.env.sessionSecretKey1 || '0u@Fq|nTyaHG';
const sessionSecretKey2 = process.env.sessionSecretKey2 || 'U99}G9zTsKDg';
const port = +process.env.port || 3001;

/* routes */
const APIRoute = require(path.join(__dirname, 'routes', 'APIRoute.js'));
const registerRoute = require(path.join(__dirname, 'routes', 'registerRoute.js'));
const loginRoute = require(path.join(__dirname, 'routes', 'loginRoute.js'));



/*   ---==== Connect to DB ====---   */

mongoose.connect('mongodb://127.0.0.1/appex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => err ? console.error(err) : console.log('[+] База подключена!'));



/*   ---==== Express server ====---   */

const app = express();
app.use(bodyParser.json());

/* set static dir */
app.use(express.static(path.join(__dirname, 'build')));

/* start the server! */
const server = app.listen(port, (err) => {
  err ? console.error(err) : console.log('[+] Сервер поднят!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



/*   ---==== Passport local strategy ====---   */

app.use(session({ keys: [sessionSecretKey1, sessionSecretKey2] }));

/* Session */
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  done(null, { name: 'Vasya', id})
});

const mustBeAuth = (req, res, next) => {  // Is user authenticated
  req.isAuthenticated() ? next() : res.redirect('/login');
}

app.use(passport.initialize({}));
app.use(passport.session({}));



/*   ---==== Controller ====---   */

/* registration */
app.use('/sign_up', registerRoute);

/* sign in */
app.use('/sign_in', loginRoute);

/* secure urls */
app.all('/api', mustBeAuth);
app.all('/api/*', mustBeAuth);

/* api */
app.use('/api', APIRoute);



/*   ---==== Use socket.io ====---   */

const io = socketIo(server);
io.on('connection', (socket) => {
  socket.on('test', data => {
    console.log('CONNECT: ', data);
  });
});
