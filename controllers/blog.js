const Blog = require('../models/blog')

const getBlogList = async (req, res) => {
  const blogs = await Blog.find().populate('author').exec()
  res.status(200).send(blogs)
}

const getSingleBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author').exec()
  res.status(200).send(blog)
}

const insertBlog = async (req, res) => {
  const blog = new Blog({
    ...req.body,
    author: req.user._id,
  })
  await blog.save()
  res.status(201).send()
}

const updateBlog = async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).send()
}

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (blog.author !== req.user._id) {
    res.status(403).send({
      message: "You cannot delete other people's posts!",
    })
    return
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).send()
}

module.exports = {
  getBlogList,
  getSingleBlog,
  insertBlog,
  updateBlog,
  deleteBlog,
}
