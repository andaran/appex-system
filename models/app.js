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
  createDate: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  clonedFrom: {
    type: String,
  },
  code: {
    type: Object,
    html: { type: String },
    css: { type: String },
    js: { type: String },
  },
  releaseCode: {
    type: Object,
    html: { type: String },
    css: { type: String },
    js: { type: String },
  },
});

const app = mongoose.model('app', appSchema, 'apps');

module.exports = app;