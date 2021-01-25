const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  roomPass: {
    type: String,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const room = mongoose.model('room', roomSchema, 'rooms');

module.exports = room;