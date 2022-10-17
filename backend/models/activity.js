const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
  board: {
    type: mongoose.Types.ObjectId,
    ref: "board"
  },
  card: {
    type: mongoose.Types.ObjectId,
    ref: "card"
  },
  date: {
    type: Date,
    default: () => new Date()
  },
}, { versionKey: false })

module.exports = mongoose.model('activity', ActivitySchema);