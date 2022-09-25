const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')

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

  if (user) {
    const { password, ...rest } = user.toObject()
    const accessToken = jwt.sign(
      {
        data: rest,
        exp: Math.floor(Date.now() / 100) + 60 * 60 * 24,
      },
      process.env.JWT_SECRET_KEY
    )
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
