const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
}, { versionKey: false })

module.exports = mongoose.model('invite', InviteSchema);