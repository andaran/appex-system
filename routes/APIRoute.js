
/*   ---==== Api routes ====---   */

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const generateAppId = require(path.join(__dirname, '../', 'IdActions', 'generateAppID.js'));
const generateRoomId = require(path.join(__dirname, '../', 'IdActions', 'generateRoomID.js'));

const router = express.Router();

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));
const App = require(path.join(__dirname, '../', 'models', 'app.js'));
const Room = require(path.join(__dirname, '../', 'models', 'room.js'));

const clearParams = (params, scheme) => {
  const updateObj = {};
  scheme.forEach(param => {
    if (params[param] !== undefined) {
      updateObj[param] = params[param];
    }
  });
  return updateObj;
}



/*   ---==== User ====---   */

router.post('/get_user', (req, res) => {
  res.json({ status: 'ok', user: req.user });
});

router.post('/change_user', (req, res) => {

  /* public params */
  const scheme = ['installedApps', 'settings'];

  /* update user */
  User.updateOne({ id: req.user.id }, { $set: clearParams(req.body, scheme) }).then(user => {
    res.json({ status: 'ok' });
  }, err => {
    res.json({ status: 'err' });
  });
});

router.post('/change_user_private', (req, res) => {

  /* private params */
  const scheme = ['username', 'email'];
  const updateObj = clearParams(req.body, scheme);

  /* check params available and update user */
  User.find(updateObj).then(users => {

    /* if username is used */
    if (users.length !== 0) { return res.json({ status: 'err', message: 'username already used' }); }

    /* update user */
    User.updateOne({ id: req.user.id }, { $set: updateObj }).then(user => {
      res.json({ status: 'ok' });
    }, err => {
      res.json({ status: 'err', message: 'updating error' });
    });
  }, err => res.json({ status: 'err', message: 'updating fatal error' }));
});

router.post('/change_password', (req, res) => {

  /* find user */
  User.findOne({ username: req.user.username }).then(foundUser => {
    if (foundUser === null) { return res.json({ status: 'err' }); }

    /* check password */
    bcrypt.compare(req.body.oldPassword, foundUser.password, (err, result) => {
      if (!result || err) { return res.json({ status: 'err', message: 'not coincide' }); }

      /* generate password hash */
      bcrypt.hash(req.body.newPassword, 10).then(hash => {

        /* update user */
        User.updateOne({ username: req.user.username }, { $set: { password: hash } }).then(user => {
          res.json({ status: 'ok' });
        }, err => {
          res.json({ status: 'err' });
        }).catch(err => res.json({ status: 'err' }));
      });
    });
  });
});

router.post('/log_out', (req, res) => {
  req.logout();
  res.json({ status: 'ok' });
});

router.post('/delete_user', (req, res) => {

  /* delete user */
  User.deleteOne({ ...req.user }).then((info) => {
    res.json({ status: 'ok' });
  }, err => {
    res.json({ status: 'err' });
  });
});



/*   ---==== Projects ====---   */

router.post('/get_projects', (req, res) => {

  /* find projects by user id */
  App.find({ author: req.user.id }).then(foundApps => {

    /* send found app */
    res.json(foundApps);
  });
});

router.post('/create_app', (req, res) => {

  /* generate id */
  generateAppId().then(appId => {

    /* create app object */
    const opt = { encoding:'utf8', flag:'r' };
    let appObj = {
      title: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      id: appId,
      storeVisibility: req.body.downloadAvailable,
      createDate: Date.now(),
      author: req.user.id,
      code: {
        html: fs.readFileSync(path.join(__dirname, '../', 'startCode', 'code.html'), opt),
        css: fs.readFileSync(path.join(__dirname, '../', 'startCode', 'code.css'), opt),
        js: fs.readFileSync(path.join(__dirname, '../', 'startCode', 'code.js'), opt),
      },
      releaseCode: { html: '', css: '', js: '' },
    }

    /* save new app */
    const app = new App(appObj);
    app.save().then(newApp => {
      res.json({ status: 'ok' });
    }, err => {
      console.log(err);
      res.json({ status: 'err' });
    });

  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});

router.post('/change_app/:mode', (req, res) => {

  /* switch change mode */
  let updateObj;
  switch (req.params.mode) {

    /* app settings */
    case 'settings':
      updateObj = {
        title: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        storeVisibility: req.body.downloadAvailable,
      }
      break;

    /* app code */
    case 'code':
      updateObj = {
        code: req.body.code,
        releaseCode: req.body.releaseCode,
      }
      break;

    default:
      updateObj = {};
      break;
  }

  /* update app */
  App.updateOne({
    author: req.user.id,
    id: req.body.id,
  }, {
    $set: updateObj
  }).then(changedApp => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});

router.post('/delete_app', (req, res) => {

  /* delete app */
  App.deleteOne({
    author: req.user.id,
    id: req.body.id,
  }).then(changedApp => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});



/*   ---==== Rooms ====---   */

router.post('/get_rooms', (req, res) => {

  /* find rooms by user id */
  Room.find({ author: req.user.id }).then(foundRooms => {

    /* send found rooms */
    res.json(foundRooms);
  });
});

router.post('/create_room', (req, res) => {

  /* generate id */
  generateRoomId().then(roomId => {

    /* create app object */
    const state = JSON.stringify({ lastChange: Date.now() });
    let roomObj = {
      author: req.user.id,
      name: 'room',
      roomId,
      roomPass: 'room',
      createDate: Date.now(),
      state,
    }

    /* save new room */
    const room = new Room(roomObj);
    room.save().then(newRoom => {
      res.json({ status: 'ok' });
    }, err => {
      console.log(err);
      res.json({ status: 'err' });
    });

  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});

router.post('/change_room', (req, res) => {

  const updateObj = {
    name: req.body.name,
    roomPass: req.body.roomPass,
  }

  /* update room */
  Room.updateOne({ author: req.user.id, roomId: req.body.roomId }, { $set: updateObj }).then(changedRoom => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});

router.post('/delete_room', (req, res) => {

  /* delete app */
  Room.deleteOne({ roomId: req.body.roomId }).then(removedRoom => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});



/*   ---==== Apps ====---   */

router.post('/get_app', (req, res) => {

  /* find app by user id */
  App.findOne({
    $or: [
      {
        author: req.user.id,
        id: req.body.appId,
      },
      {
        id: req.body.appId,
        storeVisibility: true,
      }
    ]
  }).then(foundApp => {

    /* send found rooms */
    if (foundApp === null) {
      res.json({ status: 'err' });
    } else {
      res.json({ status: 'ok', app: foundApp, user: req.user });
    }
  }).catch(err => res.json({ status: 'err' }));
});



/*   ---==== Store ====---  */

router.post('/get_last_apps', (req, res) => {

  /* find last 100 apps */
  App.find()
    .sort({'date': -1})
    .limit(100)
    .then(foundApps => {

    /* send found rooms */
    if (foundApps === null) {
      res.json({ status: 'err' });
    } else {

      foundApps = foundApps.map(app => {
        return {
          title: app.title,
          icon: app.icon,
          color: app.color,
          id: app.id,
        }
      });

      res.json({ status: 'ok', apps: foundApps });
    }
  }).catch(err => res.json({ status: 'err' }));
});

router.post('/get_find_apps', (req, res) => {

  /* find apps */
  App.find({$or: [
      { title: req.body.search },
      { id: req.body.search }
    ]})
    .sort({'date': -1})
    .limit(100)
    .then(foundApps => {

      /* send found rooms */
      if (foundApps === null) {
        res.json({ status: 'err' });
      } else {

        foundApps = foundApps.map(app => {
          return {
            title: app.title,
            icon: app.icon,
            color: app.color,
            id: app.id,
          }
        });

        res.json({ status: 'ok', apps: foundApps });
      }
    }).catch(err => res.json({ status: 'err' }));
});

module.exports = router;