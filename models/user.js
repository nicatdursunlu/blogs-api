const mongoose = require('mongoose')
const crypto = require('crypto')

const SALT = '12345'

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: String,
})

UserSchema.pre('save', function (next) {
  this.password = crypto
    .pbkdf2Sync(this.password, SALT, 100000, 64, 'sha512')
    .toString('hex')
  next()
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel
