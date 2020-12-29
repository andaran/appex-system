const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  storeVisibility: {
    type: Boolean,
    required: true,
  },
  author: {
    type: Object,
    required: true,
    username: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Boolean,
      required: true,
    },
  },
  code: {
    type: Object,
    required: true,
    html: { type: String },
    css: { type: String },
    js: { type: String },
  },
  releaseCode: {
    type: Object,
    required: true,
    html: { type: String },
    css: { type: String },
    js: { type: String },
  },
});

const app = mongoose.model('app', appSchema, 'apps');

module.exports = app;