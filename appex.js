
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
const SessionSecretKeys = ['*1hF5l07%4f@kBFj', 'djhg&hgaschg34nb'];



/*   ---==== Connect to DB ====---   */

mongoose.connect('mongodb://127.0.0.1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => err ? console.error(err) : console.log('[+] База подключена!'));



/*   ---==== Express server ====---   */

const app = express();
app.use(bodyParser.json());

/* set static dir */
app.use(express.static(path.join(__dirname, 'build')));

/* start the server! */
const server = app.listen(3000, (err) => {
  err ? console.error(err) : console.log('[+] Сервер поднят!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



/*   ---==== Passport local strategy ====---   */

app.use(session({ keys: SessionSecretKeys }));
const LocalStrategy = require('passport-local').Strategy;

/* Authorisation */
passport.use('local', new LocalStrategy({}, (username, password, done) => {
  if (username === 'admin' && password === 'admin') {
    return done(null, users[0]);
  } else if (username === 'user' && password === 'user') {
    return done(null, users[1]);
  } else {
    return done(null, false);
  }
}));

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

app.post('/login', (req, res, next) => {
  passport.authenticate('local', {}, (err, user, info) => {

    /* if err or user isn`t being */
    if (err) { return res.json({ status: 'err', text: err }); }
    if (!user) { return res.json({ status: 'no_user', text: false }); }

    /* login user */
    req.logIn(user, err => {

      /* if err */
      if (err) { return res.json({ status: 'err', text: err }); }

      /* return user object */
      return res.json({ status: 'ок', user });
    });
  })(req, res, next);
});

app.all('/api', mustBeAuth);
app.all('/api/*', mustBeAuth);



/*   ---==== Use socket.io ====---   */

const io = socketIo(server);
io.on('connection', (socket) => {
  socket.on('test', data => {
    console.log('CONNECT: ', data);
  });
});
