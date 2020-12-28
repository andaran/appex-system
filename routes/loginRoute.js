
/*   ---==== Sign in ====---   */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));

const LocalStrategy = require('passport-local').Strategy;

/* Authorisation */
passport.use('local', new LocalStrategy({}, (username, password, done) => {

  /* find user by username */
  User.findOne({ username }).then(foundUser => {
    if (foundUser === null) { return done(null, false); }

    /* check password */
    bcrypt.compare(password, foundUser.password, (err, result) => {
      result ? done(null, foundUser) : done(null, false);
    });
  });
}));

router.post('/', (req, res, next) => {
  passport.authenticate('local', {}, (err, user, info) => {

    /* if err or user isn`t being */
    if (err) { return res.json({ status: 'err', text: err }); }
    if (!user) { return res.json({ status: 'no_user', text: false }); }

    /* login user */
    req.logIn(user, err => {

      /* if err */
      if (err) { return res.json({ status: 'err', text: err }); }

      /* return user object */
      return res.json({ status: 'ok', user: {
        username: user.username,
        email: user.email,
        id: user.id,
        rooms: user.rooms,
        settings: user.settings,
        userSettings: user.userSettings,
      }});
    });
  })(req, res, next);
});

module.exports = router;