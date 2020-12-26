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
  rooms: { type: Array },
  settings: { type: Array },
  userSettings: { type: Array },
});

const user = mongoose.model('task', userSchema, 'tasks');

module.exports = user;