// models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  image_base64: String, // base64 image string
  framename: String,
  score: Number,
  issueTitle: [String],
  issue: [String],
  prosTitle: [String],
  pros: [String],
  //to be added : Clarity Score
}, { timestamps: true });

module.exports = mongoose.model('SharedData', dataSchema);
