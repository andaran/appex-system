
/* modules */
const path = require('path');
const fs = require('fs');
const generateAppId = require(path.join(__dirname, '../', 'IdActions', 'generateAppID.js'));
const generateRoomId = require(path.join(__dirname, '../', 'IdActions', 'generateRoomID.js'));

/* models */
const App = require(path.join(__dirname, '../', 'models', 'app.js'));
const Room = require(path.join(__dirname, '../', 'models', 'room.js'));
const User = require(path.join(__dirname, '../', 'models', 'user.js'));

/* alerts */
const start = require(path.join(__dirname, '../', 'alerts', 'code', 'start.js'));
const main = require(path.join(__dirname, '../', 'alerts', 'code', 'main.js'));
const project = require(path.join(__dirname, '../', 'alerts', 'code', 'project.js'));

/* alerts obj */
const alerts = {
  start, main, project,
}



/*   ---==== Start app sender ====---   */

const createStartApp = (userId) => {

  /* create app */
  new Promise((resolve, reject) => {

    /* generate id */
    generateAppId().then(appId => {

      /* create app object */
      const opt = {encoding: 'utf8', flag: 'r'};
      const appCode = {
        html: fs.readFileSync(path.join(__dirname, 'code', 'code.html'), opt),
        css: fs.readFileSync(path.join(__dirname, 'code', 'code.css'), opt),
        js: fs.readFileSync(path.join(__dirname, 'code', 'code.js'), opt),
      }
      let appObj = {
        title: 'Relay',
        icon: 'faLightbulb',
        color: '#2ecc71',
        id: appId,
        storeVisibility: false,
        createDate: Date.now(),
        author: userId,
        code: appCode,
        releaseCode: appCode,
      }

      /* save new app */
      const app = new App(appObj);
      app.save()
        .then(status => resolve(appId), err => reject(err))
        .catch(err => reject(err));
    });

  /* create room */
  }).then((appId) => {

    /* generate id */
    generateRoomId().then(roomId => {

      /* create app object */
      const state = JSON.stringify({ lastChange: Date.now(), status: true });
      const roomPass = '123';
      let roomObj = {
        author: userId,
        name: 'RelayRoom',
        roomId,
        roomPass,
        createDate: Date.now(),
        state,
      }

      /* save new room */
      const room = new Room(roomObj);
      room.save()

        /* add user settings */
        .then(() => {

          /* update user */
          const settings = {
            id: appId,
            body: { roomId, roomPass, }
          }
          User.updateOne(
            { id: userId },
            { $addToSet:
                {
                  settings: settings,
                  alerts: [main, start, project]
                }
            }
          ).catch(err => console.log('Error in creating start user settings!', err));

        }).catch(err => console.log('Error in creating start room!', err));
    });
  }).catch(err => console.log('Error in creating start app!', err));
}

module.exports = createStartApp;
