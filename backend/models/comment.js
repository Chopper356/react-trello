const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: () => new Date()
  },
  card: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "card"
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  }
}, { versionKey: false })

module.exports = mongoose.model('comment', CommentSchema);