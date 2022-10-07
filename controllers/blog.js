const Blog = require('../models/blog')
const catchError = require('../utils/catchError')

const getBlogList = catchError(async (req, res) => {
  const { page = 1, limit = 10, q = '' } = req.query

  const userId = req.user._id
  const offset = (page - 1) * limit
  const titleFilter = { $regex: '.*' + q + '.*', $options: 'i' }

  const blogs = await Blog.find({
    title: titleFilter,
  })
    .select('_id title body tags likes')
    .where('author')
    .equals(userId)
    .populate('author', '_id firstName lastName image')
    .sort({ createdAt: 'desc' })
    .skip(offset)
    .limit(limit)
    .exec()

  const total = await Blog.find({
    title: titleFilter,
  })
    .where('author')
    .equals(userId)
    .count()

  res.status(200).send({ list: blogs, total })
})

const getSingleBlog = catchError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', '_id firstName lastName email image')
    .exec()
  res.status(200).send(blog)
})

const insertBlog = catchError(async (req, res) => {
  const blog = new Blog({
    ...req.body,
    author: req.user._id,
  })
  await blog.save()
  res.status(201).send()
})

const updateBlog = catchError(async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).send()
})

const likeBlog = catchError(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog.likes.includes(req.user._id)) {
    blog.likes.pull(req.user._id)
  } else {
    blog.likes.push(req.user._id)
  }
  await blog.save()
  res.status(200).send()
})

const deleteBlog = catchError(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (blog.author !== req.user._id) {
    res.status(403).send({
      message: "You cannot delete other people's posts!",
    })
    return
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

module.exports = {
  getBlogList,
  getSingleBlog,
  insertBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
}
