
/*   ---==== Api routes ====---   */

const express = require('express');
const path = require('path');

const router = express.Router();

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));
const App = require(path.join(__dirname, '../', 'models', 'app.js'));

router.post('/get_user', (req, res) => {
  res.json({ status: 'ok', user: req.user });
});

router.post('/get_projects', ((req, res) => {

  /* find projects by user id */
  App.find({ user: { ...req.body } }).then(foundApps => {

    /* send found app */
    res.json(foundApps);
  });
}));

module.exports = router;