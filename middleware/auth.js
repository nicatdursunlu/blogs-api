const Session = require('../models/session')

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.body.token
  if (token) {
    const currentSession = await Session.findOne({ accessToken: token })
      .populate('user')
      .exec()

    if (currentSession.expiresAt.getTime() < Date.now()) {
      res.status(401).send({
        message: 'Your session has expired!',
      })
    } else {
      req.user = currentSession.user
      next()
    }
  } else {
    res.status(401).send({
      message: 'Unauthorized request!',
    })
  }
}

module.exports = authMiddleware
