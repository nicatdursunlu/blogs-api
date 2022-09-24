const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')

const User = require('./models/user')

const CONNECTION_STRING =
  'mongodb+srv://nijatdursunlu:dursunlunicat55@cluster0.vnhevzw.mongodb.net/blog-app?retryWrites=true&w=majority'
mongoose.connect(CONNECTION_STRING)

const app = express()
app.use(express.urlencoded())
app.use(express.json())
app.use('/public', express.static(path.resolve('public')))
app.use('/api/v1/', userRoutes)

module.exports = app
