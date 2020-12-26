
/*   ---==== Sign in ====---   */

const express = require('express');
const router = express.Router();
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

/* Authorisation */
passport.use('local', new LocalStrategy({}, (username, password, done) => {
  // TODO: make user auth
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
      return res.json({ status: 'ок', user });
    });
  })(req, res, next);
});

module.exports = router;