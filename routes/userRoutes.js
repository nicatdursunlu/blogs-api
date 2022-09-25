const express = require('express')
const multer = require('multer')
const crypto = require('crypto')

const User = require('../models/user')
const Session = require('../models/session')

const SALT = '12345'

const router = express.Router()

const fileFilter = (req, file, cb) => {
  const error = { message: 'Invalid mime type!' }
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid mime type!'), false)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const fileNameParts = file.originalname.split('.')
    const extension = fileNameParts[fileNameParts.length - 1]
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + '.' + extension)
  },
})

const upload = multer({ storage, fileFilter })

router.post('/register', upload.single('image'), async (req, res) => {
  const { path } = req.file
  const { firstName, lastName, email, password } = req.body
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    image: path,
  })
  await user.save()
  res.status(201).send('OK!')
})

router.post('/login', async (req, res) => {
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
    res.send({ accessToken })
  } else {
    res.status(401).send({
      message: 'Email or password is not valid!',
    })
  }
})

module.exports = router
