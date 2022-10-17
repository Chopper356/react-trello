const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  index: {
    type: Number,
    required: true
  },
  list: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "list"
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
  board: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "board"
  }
}, { versionKey: false })

module.exports = mongoose.model('card', CardSchema);