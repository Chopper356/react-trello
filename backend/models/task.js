const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  board: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "board"
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
}, { versionKey: false })

module.exports = mongoose.model('task', TaskSchema);