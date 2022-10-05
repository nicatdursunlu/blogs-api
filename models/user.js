const mongoose = require('mongoose')
const crypto = require('crypto')

const SALT = process.env.PASSWORD_SALT

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
    },
    password: String,
    image: String,
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', function (next) {
  this.password = crypto
    .pbkdf2Sync(this.password, SALT, 100000, 64, 'sha512')
    .toString('hex')
  next()
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel
