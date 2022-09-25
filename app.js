const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING
mongoose.connect(CONNECTION_STRING)

const app = express()
app.use(express.urlencoded())
app.use(express.json())
app.use('/public', express.static(path.resolve('public')))
app.use('/api/v1/', userRoutes)
app.use('/api/v1/blogs', blogRoutes)

module.exports = app
