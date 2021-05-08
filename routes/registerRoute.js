
/*   ---==== Registration ====---   */

const express = require('express');
const router = express.Router();
const path = require('path');
const { uid } = require('rand-token');
const bcrypt = require('bcrypt');
const mailer = require(path.join(__dirname, '../', 'mails', 'mailer.js'));
const generateUserId = require(path.join(__dirname, '../', 'IdActions', 'generateUserID.js'));
const createStartApp = require(path.join(__dirname, '../', 'startApp', 'sender.js'));

/* alerts */
const start = require(path.join(__dirname, '../', 'alerts', 'code', 'start.js'));

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));

/* codes */
let codes = [];

/* clear old codes interval */
setInterval(clearOldCodes, 60000);

/* clear old codes */
function clearOldCodes() {
  codes.forEach((code, index) => {
    if (Date.now() - code.time > 300000) {
      codes.splice(index, 1);
      return clearOldCodes(); }
  });
}

router.post('/', (req, res) => {

  /* find users by request params */
  User.find({ username: req.body.username, email: req.body.email }).then(foundUsers => {  // Find user if he is being

    /* if user is`n being */
    if (foundUsers.length === 0) {

      /* check code */
      const codeID = req.body.codeID;
      let code = false;
      codes.forEach(item => {
        if (item.codeID === codeID) { code = item.code; }
      });

      /* if code isn`t being */
      if (code !== req.body.code) { return res.send('invalidCode'); }

      /* generate id */
      generateUserId().then(userId => {

        /* generate password hash */
        bcrypt.hash(req.body.password, 10).then(hash => {

          /* create new user */
          const user = new User({
            username: req.body.username,
            email: req.body.email,
            id: userId,
            password: hash,
            registrationDate: Date.now(),
            type: 'user',
            installedApps: [],
            settings: [],
            userSettings: {},
            alerts: [ start ],  // education
          });

          /* save new user */
          user.save().then(newUser => {

            /* create start app */
            createStartApp(userId);

            res.send('ok');
          }, err => {
            res.send('err');
          });
        });

      }, err => res.send('err'))
        .catch(err => res.send('err'));

    /* if username or email are used */
    } else { res.send('used'); }
  }, err => {
    res.send('err');
    console.error(err);
  });
});

router.post('/is_param_available', (req, res) => {

  /* find users by request params */
  User.find({ ...req.body }).then(foundUsers => {  // Find user if he is being

    /* if user is`n being */
    if (foundUsers.length === 0) {
      res.send('available');
    } else {
      res.send('used');
    }
  }, err => {
    res.send('err');
    console.error(err);
  });
});

router.post('/secure_code', (req, res) => {

  /* generate the code */
  const code = uid(8);
  const time = Date.now();
  const codeID = uid(12) + '-' + time;

  /* add code to codes */
  codes.push({ code, codeID, time });

  /* send the mail */
  mailer(req.body.email, 'Секретный код', 'code', { code }).catch(err => console.error(err));

  res.json({ status: 'ok', codeID });
});

module.exports = router;
