const mongoose = require('mongoose')

const PasswordResetSchema = new mongoose.Schema({
  user: {
    type: 'ObjectId',
    ref: 'users',
  },
  resetToken: String,
  expired: {
    type: Boolean,
    default: () => false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const PasswordResetModel = mongoose.model('passwordResets', PasswordResetSchema)

module.exports = PasswordResetModel
