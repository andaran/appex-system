
/*   ---==== Appex server ====---   */

const express = require("express");
const socketIo = require("socket.io");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('cookie-session');
const cors = require('cors');

/* include .env settings */
require('dotenv').config();

/* settings */
const sessionSecretKey1 = process.env.sessionSecretKey1;
const sessionSecretKey2 = process.env.sessionSecretKey2;
const port = +process.env.port || 3001;

/* routes */
const APIRoute = require(path.join(__dirname, 'routes', 'APIRoute.js'));
const registerRoute = require(path.join(__dirname, 'routes', 'registerRoute.js'));
const loginRoute = require(path.join(__dirname, 'routes', 'loginRoute.js'));
const changePassRoute = require(path.join(__dirname, 'routes', 'changePassRoute.js'));

/* models */
const User = require(path.join(__dirname, 'models', 'user.js'));
const Room = require(path.join(__dirname, 'models', 'room.js'));

/* requests limit */
let reqLimit = [];



/*   ---==== Connect to DB ====---   */

mongoose.connect(process.env.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => err ? console.error(err) : console.log('[+] База подключена!'));



/*   ---==== Express server ====---   */

const app = express();
app.use(bodyParser.json());

/* set cors */
// app.use(cors({ origin: '*' }));  // TODO: хз че с этим делать

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

  /* find user */
  User.findOne({ id }).then(foundUser => {
    if (foundUser === null) { return done(null, false); }

    /* return user */
    done(null, {
      username: foundUser.username,
      email: foundUser.email,
      id: foundUser.id,
      rooms: foundUser.rooms,
      settings: foundUser.settings,
      userSettings: foundUser.userSettings,
      installedApps: foundUser.installedApps,
      type: foundUser.type,
      alerts: foundUser.alerts,
    });
  });
});

const mustBeAuth = (req, res, next) => {  // Is user authenticated
  req.isAuthenticated() ? next() : res.json({ status: 'err', text: 'no_auth' });;
}

app.use(passport.initialize({}));
app.use(passport.session({}));



/*   ---==== Controller ====---   */

/* registration */
app.use('/sign_up', registerRoute);

/* sign in */
app.use('/sign_in', loginRoute);

/* change password */
app.use('/change_password', changePassRoute);

/* secure urls */
app.all('/api', mustBeAuth);
app.all('/api/*', mustBeAuth);

/* api */
app.use('/api', APIRoute);



/*   ---==== socket.io ====---   */
/*
app.use(((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}));*/

const io = socketIo(server, { log: false, origins: '*:*' });
io.on('connection', (socket) => {



  /*   ---==== Apps ====---   */

  /* connect to room */
  socket.on('connectToRoom', data => {

    /* find this room */
    Room.findOne({ roomId: data.roomId, roomPass: data.roomPass }).then(room => {
      if (room !== null) {

        /* join to room */
        socket.join(data.roomId);

        /* send state */
        const state = JSON.parse(room.state);
        socket.emit('connectSuccess', state);

        /* delete room trash */
        if (data.currentState !== undefined) {

          let keys = Object.keys(data.currentState);
          let newState = {};

          /* set new state obj */
          keys.forEach(key => {
            state[key] === undefined
              ? newState[key] = data.currentState[key]
              : newState[key] = state[key];
          });
          newState.lastChange = state.lastChange;

          newState = JSON.stringify(newState);
          Room.updateOne({ roomId: data.roomId }, { $set: { state: newState }})
            .then(info => {}, err => {});
        }
      } else {
        socket.emit('err', { type: 'RoomNotFound', roomId: data.roomId });
      }
    }, err => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));
  });

  /* update state */
  socket.on('updateState', data => {



    /*   ---==== Request limit ====---   */

    const req = reqLimit.find(elem => elem.id = data.roomId);

    /* send err if over 600 reqs in list */
    if (req && req.timeout - Date.now() > 0 && req.count > 600) {
      return socket.emit('err', { type: 'TooManyRequests', roomId: data.roomId });
    }

    /* update request timeout */
    if (req && req.timeout - Date.now() <= 0) {
      reqLimit = reqLimit.map(elem => {
        if (elem.id === data.roomId) {
          return { ...elem, count: 1, timeout: Date.now() + 60000 };
        } else { return elem; }
      });
    }

    /* add request to list */
    if (!req) {
      reqLimit.push({ timeout: Date.now() + 60000, count: 1, id: data.roomId });
    }

    /* requests count ++ */
    if (req) {
      reqLimit = reqLimit.map(elem => {
        if (elem.id === data.roomId) {
          return { ...elem, count: elem.count + 1 };
        } else { return elem; }
      });
    }

    /* find this room */
    Room.findOne({ roomId: data.roomId, roomPass: data.roomPass }).then(room => {
      if (room !== null) {

        /* update room */
        try {
          const oldState = JSON.parse(room.state);
          const newState = JSON.stringify({ ...oldState, ...data.params, lastChange: Date.now() });

          /* update room */
          Room.updateOne({ roomId: data.roomId }, { $set: { state: newState }}).then(info => {}, err => {});

          data.params.lastChange = Date.now();
          socket.to(data.roomId).emit('updateState', data);
          socket.emit('updateState', data);
        } catch(e) {
          socket.to(data.roomId).emit('err', { type: 'UnknownServerError', roomId: data.roomId });
        }
      }
    });
  });

  /* disconnect */
  socket.on('disconnectFromRoom', roomId => {
    socket.leave(roomId);
  });

  /* error */
  socket.on('err', data => {
    socket.to(data.roomId).emit('err', data);
  });

  /* ping test */
  socket.on('ping', data => {
    socket.emit('ping', data);
  });



  /*   ---==== Development ====---   */

  /* connect to devRoom */
  socket.on('connectToDevRoom', data => {

    /* join to room */
    socket.join(data.roomId);
  });

  /* send update event */
  socket.on('updateAppCode', data => {
    socket.to(data.roomId).emit('updateAppCode', data);
  });
});
