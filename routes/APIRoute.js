
/*   ---==== Api routes ====---   */

const express = require('express');
const path = require('path');
const generateAppId = require(path.join(__dirname, '../', 'IdActions', 'generateAppID.js'));

const router = express.Router();

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));
const App = require(path.join(__dirname, '../', 'models', 'app.js'));



/*   ---==== User ====---   */

router.post('/get_user', (req, res) => {
  res.json({ status: 'ok', user: req.user });
});

router.post('/change_user', (req, res) => {
  User.updateOne({ id: req.user.id }, { $set: req.body }).then(user => {  // Update the task
    res.json({ status: 'ok' });
  }, err => {
    res.json({ status: 'err' });
  });
});



/*   ---==== Projects ====--- */

router.post('/get_projects', ((req, res) => {

  /* find projects by user id */
  App.find({ author: { username: req.user.username, id: req.user.id } }).then(foundApps => {

    /* send found app */
    res.json(foundApps);
  });
}));

router.post('/create_app', (req, res) => {

  /* generate id */
  generateAppId().then(appId => {

    /* create app object */
    let appObj = {
      title: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      id: appId,
      storeVisibility: req.body.downloadAvailable,
      createDate: Date.now(),
      author: {
        username: req.user.username,
        id: req.user.id,
      },
      code: {
        html: 'Html is here ...',
        css: '// Css is here ...',
        js: '/* JS is here ... */',
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
    author: { username: req.user.username, id: req.user.id },
    id: req.body.id,
  }, {
    $set: updateObj
  }).then(changedApp => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
});

router.post('/delete_app', ((req, res) => {

  /* delete app */
  App.deleteOne({
    author: { username: req.user.username, id: req.user.id },
    id: req.body.id,
  }).then(changedApp => {
    res.json({ status: 'ok' });
  }, err => res.json({ status: 'err' }))
    .catch(err => res.json({ status: 'err' }));
}));

module.exports = router;