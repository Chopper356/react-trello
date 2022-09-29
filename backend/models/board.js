const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
  members: [{
    type: mongoose.Types.ObjectId,
    ref: "user"
  }],
  image: {
    type: String
  }
}, { versionKey: false })

module.exports = mongoose.model('board', BoardSchema);