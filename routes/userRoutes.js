const express = require('express')
const upload = require('../middleware/fileUpload')
const userController = require('../controllers/user')

const userRouter = express.Router()
const imageUpload = upload.single('image')

userRouter.post('/register', imageUpload, userController.registerUser)
userRouter.post('/login', userController.loginUser)

module.exports = userRouter
