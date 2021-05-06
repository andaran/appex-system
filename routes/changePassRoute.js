
/*   ---==== Registration ====---   */

const express = require('express');
const router = express.Router();
const path = require('path');
const { uid } = require('rand-token');
const bcrypt = require('bcrypt');
const mailer = require(path.join(__dirname, '../', 'mails', 'mailer.js'));

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

  /* check code */
  const codeID = req.body.codeID;
  let code = false;
  codes.forEach(item => {
    if (item.codeID === codeID) { code = item.code; }
  });

  /* if code isn`t being */
  if (code !== req.body.code) { return res.send('invalidCode'); }

  /* generate password hash */
  bcrypt.hash(req.body.newPassword, 10).then(hash => {

    /* update user password */
    User.updateOne(
      { username: req.body.username, email: req.body.email },
      { $set: { password: hash }}
    ).then(status => {
      res.send('ok');
    }, err => {
      res.send('used');
    }).catch(err => {
      res.send('err');
      console.log(err);
    });
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
  mailer(req.body.email, 'Код для восстановления пароля', 'changePassword', { code })
    .catch(err => console.error(err));

  res.json({ status: 'ok', codeID });
});

module.exports = router;
