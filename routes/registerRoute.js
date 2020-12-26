
/*   ---==== Registration ====---   */

const express = require('express');
const router = express.Router();
const path = require('path');
const { uid } = require('rand-token');
const mailer = require(path.join(__dirname, '../', 'mails', 'mailer.js'));

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));

/* codes */
let codes = [];

router.post('/', (req, res) => {
  console.log(req.body);

  /* find users by request params */
  User.find({ ...req.body }).then(foundUsers => {  // Find user if he is being
    console.log(...req.body);
    /* if user is`n being */
    if (foundUsers.length === 0) {

      /* create new user */
      const user = new User({ ...req.body });
      user.save().then(newTask => {
        res.send('ok');
      }, err => {
        res.send('err');
      });

    } else {
      res.send('used');
    }
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
  const now = Date.now();
  const codeID = uid(12) + '-' + now;

  /* add code to codes */
  codes.push({ code, codeID, now });
  console.log(codes, req.body.email);

  /* send the mail */
  mailer(req.body.email, 'Секретный код', 'code', { code }).catch(err => console.error(err));

  res.send('ok');
});

module.exports = router;
