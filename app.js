require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
const errorMiddleware = require('./middleware/error')
const notFound = require('./middleware/notFound')

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
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(mongoSanitize())
app.use(xss())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

app.use('/public', express.static(path.resolve('public')))
app.use('/api/v1/', userRoutes)
app.use('/api/v1/blogs', blogRoutes)

app.all('*', notFound)
app.use(errorMiddleware)

module.exports = app
