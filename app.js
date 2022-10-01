require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')

const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
const errorMiddleware = require('./middleware/error')

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING
mongoose.connect(CONNECTION_STRING)

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '16kb' }))
app.use(limiter)

app.use('/public', express.static(path.resolve('public')))
app.use('/api/v1/', userRoutes)
app.use('/api/v1/blogs', blogRoutes)
app.all('*', (req, res) => {
  res.status(404).send({
    message: 'Requested URl not found!',
  })
})

app.use(errorMiddleware)

module.exports = app
