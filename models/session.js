const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema(
  {
    user: {
      type: 'ObjectId',
      ref: 'users',
    },
    accessToken: String,
    ip: String,
    os: String,
    browser: String,
    terminated: {
      type: Boolean,
      default: () => false,
    },
  },
  {
    timestamps: true,
  }
)

const SessionModel = mongoose.model('sessions', SessionSchema)

module.exports = SessionModel
