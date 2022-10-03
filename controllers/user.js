const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')
const catchError = require('../utils/catchError')
const SALT = process.env.PASSWORD_SALT

const checkUserEmail = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email })

  if (existingUser) {
    res.status(400).send({
      message: 'User with this email already exists!',
    })
  } else {
    next()
  }
}

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

const loginUser = catchError(async (req, res) => {
  const { email, password } = req.body

  const hashedPassword = crypto
    .pbkdf2Sync(password, SALT, 100000, 64, 'sha512')
    .toString('hex')

  const user = await User.findOne({ email, password: hashedPassword })
    .select('_id firstName lastName email image')
    .exec()

  if (user) {
    const { password, ...rest } = user.toObject()
    const accessToken = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY, {
      expiresIn: '24h',
    })

    res.send({
      accessToken,
    })
  } else {
    res.status(401).send({
      message: 'Username or password is not correct!',
    })
  }
})

const requestPasswordReset = catchError(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    res.status(400).send({
      message: 'No user found with this email!',
    })
    return
  }

  const resetToken = crypto.randomBytes(32).toString('base64url')

  const passwordReset = new PasswordReset({
    user: user._id,
    resetToken,
  })
  await passwordReset.save()

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const linkToPasswordResetPage =
    'https://localhost:8080/reset-password/' + resetToken

  await transporter.sendMail({
    from: 'Blogs API <noreply@blogs.info>',
    to: email,
    subject: 'Password reset',
    text:
      'Oi pal! Looks like you have lost your shit!' +
      `To get your shit together please click the link below and follow the instructions:
      ${linkToPasswordResetPage}`,
    html: `
      <h1>Password reset</h1>
      <p>
        Oi pal! Looks like you have lost your shit!
        To get your shit together please click the link below and follow the instructions:
        <a href=${linkToPasswordResetPage} target="_blank">Reset password</a>
      </p>
    `,
  })

  res.send({
    message: 'Email has been sent to you to reset your password!',
  })
})

const resetPassword = catchError(async (req, res) => {
  const { newPassword, resetToken } = req.body

  const hashedPassword = crypto
    .pbkdf2Sync(newPassword, SALT, 100000, 64, 'sha512')
    .toString('hex')

  const passwordReset = await PasswordReset.findOne({
    resetToken,
    expired: false,
  })

  if (passwordReset) {
    const userId = passwordReset.user
    await User.findByIdAndUpdate(userId, { password: hashedPassword })
    await PasswordReset.findByIdAndUpdate(passwordReset._id, { expired: true })
    res.send({
      message: 'Your password has been reset!',
    })
  } else {
    res.send({
      message: 'This password reset request does not exist!',
    })
  }
})

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  checkUserEmail,
}
