const express = require('express')
const Blog = require('../models/blog')
const Session = require('../models/session')

const router = express.Router()

router.use(async (req, res, next) => {
  const token = req.headers.token || req.query.token || req.body.token
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
})

router.get('/', async (req, res) => {
  const blogs = await Blog.find().populate('author').exec()
  res.status(200).send(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author').exec()
  res.status(200).send(blog)
})

router.post('/', async (req, res) => {
  const blog = new Blog({
    ...req.body,
    author: req.user._id,
  })
  await blog.save()
  res.status(201).send()
})

router.put('/:id', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).send()
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog.author !== req.user.id) {
    res.status(403).send({
      message: 'You are not allowed to delete this blog!',
    })
    return
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(200).send()
})

module.exports = router
