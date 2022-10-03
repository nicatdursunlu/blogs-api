const express = require('express')
const upload = require('../middleware/fileUpload')
const userController = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

const userRouter = express.Router()
const imageUpload = upload.single('image')

userRouter.post(
  '/register',
  userController.checkUserEmail,
  imageUpload,
  userController.registerUser
)
userRouter.post('/login', userController.loginUser)
userRouter.patch('/password', userController.resetPassword)
userRouter.post('/password/request-reset', userController.requestPasswordReset)
userRouter.get('/me', authMiddleware, userController.getUserInfo)

module.exports = userRouter
