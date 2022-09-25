const crypto = require('crypto')
const User = require('../models/user')
const Session = require('../models/session')

const SALT = process.env.PASSWORD_SALT

const registerUser = async (req, res) => {
  const { path } = req.file
  const { firstName, lastName, password, email } = req.body
  const user = new User({
    firstName,
    lastName,
    password,
    email,
    image: path,
  })
  await user.save()
  res.status(201).send()
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const hashedPassword = crypto
    .pbkdf2Sync(password, SALT, 100000, 64, 'sha512')
    .toString('hex')

  const user = await User.findOne({ email, password: hashedPassword })
  const accessToken = crypto.randomBytes(32).toString('base64')

  const session = new Session({
    user: user._id,
    accessToken,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
  })

  await session.save()

  if (user) {
    res.send({
      accessToken,
    })
  } else {
    res.status(401).send({
      message: 'Username or password is not correct!',
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
}
