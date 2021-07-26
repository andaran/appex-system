
/*   ---==== Appex server ====---   */

const express = require("express");
const socketIo = require("socket.io");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('cookie-session');

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
      type: foundUser.type,
      alerts: foundUser.alerts,
    });
  });
});

/* is user authenticated */
const mustBeAuth = (req, res, next) => {
  req.isAuthenticated() ? next() : res.json({ status: 'err', text: 'no_auth' });
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

/*   ==================================   */



/*   ---==== CORE API functions ====---   */

/* checking request limit */
/**
 * Проверяет, сколько раз пользователь делал запрос за эту минуту.
 *
 * @param {object} data - что пришло с клиента
 * @returns {Promise} - реджектит ошибку в случае привышения лимита
 */
const checkRequestLimit = (data) => {
  return new Promise((resolve, reject) => {

    const req = reqLimit.find(elem => elem.id = data.roomId);

    /* send err if over 600 reqs in list */
    if (req && req.timeout - Date.now() > 0 && req.count > 600) {
      return reject('TooManyRequests');
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

    /* done! */
    resolve();

  });
}

/* update state */
/**
 * Обновляет обьект состояния.
 *
 * @param {object} data - что пришло с клиента
 * @returns {Promise} - реджектит обьект с ошибкой или резолвит обновленное состояние
 *
 * @example
 * updateState({
 *    roomId: "123",
 *    roomPass: "123",
 *    params: {
 *      status: true
 *    }
 * });
 */
const updateState = (data) => {
  return new Promise((resolve, reject) => {

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
          resolve(data);
        } catch(e) {
          reject({ type: 'UnknownServerError', roomId: data.roomId });
        }
      } else {
        reject({ type: 'RoomNotFound', roomId: data.roomId });
      }
    }, () => reject({ type: 'RoomNotFound', roomId: data.roomId }))
        .catch(() => reject({ type: 'UnknownServerError', roomId: data.roomId }));
  });
}

/* invert property */
/**
 * Инвертирует значение указанного св-ва обьекта состояния.
 *
 * @param {object} data - что пришло с клиента
 * @returns {Promise} - реджектит обьект с ошибкой или резолвит обновленное состояние
 *
 * @example
 * invertProperty({
 *    roomId: "123",
 *    roomPass: "123",
 *    property: "status"
 * });
 */
const invertProperty = (data) => {
  return new Promise((resolve, reject) => {

    /* find this room */
    Room.findOne({ roomId: data.roomId, roomPass: data.roomPass }).then(room => {
      if (room !== null) {

        /* update room */
        try {
          const oldState = JSON.parse(room.state);

          if (typeof oldState[data.property] === 'boolean') {
            oldState[data.property] = !oldState[data.property];
          } else {
            return reject({ type: 'InvalidParam', roomId: data.roomId });
          }

          const newState = JSON.stringify({ ...oldState, lastChange: Date.now() });

          /* update room */
          Room.updateOne({ roomId: data.roomId }, { $set: { state: newState }}).then(info => {}, err => {});

          const params = { ...data.params, lastChange: Date.now(), };
          params[data.property] = oldState[data.property];
          data.params = params;

          resolve(data);
        } catch(e) {
          reject({ type: 'UnknownServerError', roomId: data.roomId });
        }
      } else {
        reject({ type: 'RoomNotFound', roomId: data.roomId });
      }
    }, () => reject({ type: 'RoomNotFound', roomId: data.roomId }))
        .catch(() => reject({ type: 'UnknownServerError', roomId: data.roomId }));
  });
}

/* change numeric property */
/**
 * Прибавляет переданное число к указанному св-ву обьекта состояния.
 *
 * @param {object} data - что пришло с клиента
 * @returns {Promise} - реджектит обьект с ошибкой или резолвит обновленное состояние
 *
 * @example
 * changeNumericProperty({
 *    roomId: "123",
 *    roomPass: "123",
 *    property: "status",
 *    value: -15
 * });
 */
const changeNumericProperty = (data) => {
  return new Promise((resolve, reject) => {

    /* find this room */
    Room.findOne({ roomId: data.roomId, roomPass: data.roomPass }).then(room => {
      if (room !== null) {

        /* update room */
        try {
          const oldState = JSON.parse(room.state);

          if (typeof oldState[data.property] === 'number' &&
              typeof data.value === 'number') {
            oldState[data.property] = oldState[data.property] + data.value;
          } else {
            return reject({ type: 'InvalidParam', roomId: data.roomId });
          }

          const newState = JSON.stringify({ ...oldState, lastChange: Date.now() });

          /* update room */
          Room.updateOne({ roomId: data.roomId }, { $set: { state: newState }}).then(info => {}, err => {});

          const params = { ...data.params, lastChange: Date.now(), };
          params[data.property] = oldState[data.property];
          data.params = params;

          resolve(data);
        } catch(e) {
          reject({ type: 'UnknownServerError', roomId: data.roomId });
        }
      } else {
        reject({ type: 'RoomNotFound', roomId: data.roomId });
      }
    }, () => reject({ type: 'RoomNotFound', roomId: data.roomId }))
        .catch(() => reject({ type: 'UnknownServerError', roomId: data.roomId }));
  });
}

/* get property */
/**
 * Возвращает значение св-ва обьекта состояния
 *
 *
 * @param {object} data - что пришло с клиента
 * @returns {Promise} - реджектит обьект с ошибкой или резолвит обьект со значением св-ва и id комнаты
 *
 * @example
 * getProperty({
 *    roomId: "123",
 *    roomPass: "123",
 *    property: "status",
 * });
 */
const getProperty = (data) => {
  return new Promise((resolve, reject) => {

    /* find this room */
    Room.findOne({ roomId: data.roomId, roomPass: data.roomPass }).then(room => {

      if (room !== null) {

        /* get property */
        const state = JSON.parse(room.state);
        if (state[data.property] !== undefined) {
          resolve({ value: state[data.property], roomId: data.roomId });
        } else {
          reject({ type: 'InvalidParam', roomId: data.roomId });
        }
      } else {
        reject({ type: 'RoomNotFound', roomId: data.roomId });
      }
    }, () => reject({ type: 'RoomNotFound', roomId: data.roomId }))
        .catch(() => reject({ type: 'UnknownServerError', roomId: data.roomId }));
  });
}

/*   ==================================   */



/*   ---==== socket.io CORE API ====---   */

/* socket server */
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
        if (data.currentState) {

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

    /* request limit  */
    checkRequestLimit(data).then(() => {

      /* update state */
      updateState(data).then((newData) => {

        /* send new state */
        socket.to(data.roomId).emit('updateState', newData);
        socket.emit('updateState', newData);

      /* any errors */
      }, (type) => socket.emit('err', { type, roomId: data.roomId }))
          .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));

    /* any errors */
    }, (type) => socket.emit('err', { type, roomId: data.roomId }))
        .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));
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



  /*   ---==== Development api ====---   */

  /* connect to devRoom */
  socket.on('connectToDevRoom', data => {

    /* join to room */
    socket.join(data.roomId);
  });

  /* send update event */
  socket.on('updateAppCode', data => {
    socket.to(data.roomId).emit('updateAppCode', data);
  });



  /*   ---==== Additional api ====---   */

  /* invert property */
  socket.on('invertProperty', data => {

    /* request limit  */
    checkRequestLimit(data).then(() => {

      /* invert property */
      invertProperty(data).then((newData) => {

        /* send new state */
        socket.to(data.roomId).emit('updateState', newData);
        socket.emit('updateState', newData);

        /* any errors */
      }, (type) => socket.emit('err', { type, roomId: data.roomId }))
          .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));

      /* any errors */
    }, (type) => socket.emit('err', { type, roomId: data.roomId }))
        .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));
  });

  /* change numeric property */
  socket.on('changeNumericProperty', data => {

    /* request limit  */
    checkRequestLimit(data).then(() => {

      /* change numeric property */
      changeNumericProperty(data).then((newData) => {

        /* send new state */
        socket.to(data.roomId).emit('updateState', newData);
        socket.emit('updateState', newData);

        /* any errors */
      }, (type) => socket.emit('err', { type, roomId: data.roomId }))
          .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));

      /* any errors */
    }, (type) => socket.emit('err', { type, roomId: data.roomId }))
        .catch(() => socket.emit('err', { type: 'UnknownServerError', roomId: data.roomId }));
  });
});



/*   ---==== Http core api ====---   */

app.post('/core_api/update_state', (req, res) => {

  /* request limit  */
  checkRequestLimit(req.body).then(() => {

    /* update state */
    updateState(req.body).then((newData) => {

      /* send new state */
      res.json(newData);
      io.in(newData.roomId).emit('updateState', newData);

    /* any errors */
    }, () => res.sendStatus(401))
        .catch(() => res.sendStatus(500));

  /* any errors */
  }, () => res.sendStatus(429))
      .catch(() => res.sendStatus(500));
});

app.post('/core_api/invert_property', (req, res) => {

  /* request limit  */
  checkRequestLimit(req.body).then(() => {

    /* invert property */
    invertProperty(req.body).then((newData) => {

      /* send new state */
      res.json(newData);
      io.in(newData.roomId).emit('updateState', newData);

    /* any errors */
    }, () => res.sendStatus(401))
        .catch(() => res.sendStatus(500));

  /* any errors */
  }, () => res.sendStatus(429))
      .catch(() => res.sendStatus(500));
});

app.post('/core_api/change_numeric_property', (req, res) => {

  /* request limit  */
  checkRequestLimit(req.body).then(() => {

    /* change numeric property */
    changeNumericProperty(req.body).then((newData) => {

      /* send new state */
      res.json(newData);
      io.in(newData.roomId).emit('updateState', newData);

    /* any errors */
    }, () => res.sendStatus(401))
        .catch(() => res.sendStatus(500));

  /* any errors */
  }, () => res.sendStatus(429))
      .catch(() => res.sendStatus(500));
});

app.post('/core_api/get_property_value', (req, res) => {

  /* request limit  */
  checkRequestLimit(req.body).then(() => {

    /* get property */
    getProperty(req.body).then((data) => {

      /* send property value */
      res.json(data);

    /* any errors */
    }, () => res.sendStatus(401))
        .catch(() => res.sendStatus(500));

  /* any errors */
  }, () => res.sendStatus(429))
      .catch(() => res.sendStatus(500));
});
