const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
  user: {
    type: 'ObjectId',
    ref: 'users',
  },
  accessToken: String,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const SessionModel = mongoose.model('sessions', SessionSchema)

module.exports = SessionModel
