const jwt = require('jsonwebtoken')

const Session = require('../models/session')

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        res.status(401).send({
          message: error.message,
        })
        return
      }
      if (decoded.exp < Date.now() / 1000) {
        res.status(401).send({
          message: 'Your session has expired!',
        })
      } else {
        req.user = decoded.data
        next()
      }
    })
  } else {
    res.status(401).send({
      message: 'Unauthorized request!',
    })
  }
}

module.exports = authMiddleware
