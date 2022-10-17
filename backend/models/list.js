const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
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
  cards: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "card"
  }],
  color: {
    type: String
  }
}, { versionKey: false })

module.exports = mongoose.model('list', ListSchema);