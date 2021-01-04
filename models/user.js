const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: String,
    required: true,
  },
  installedApps: { type: Array },
  settings: { type: Array },
  userSettings: { type: Object },
});

const user = mongoose.model('user', userSchema, 'users');

module.exports = user;