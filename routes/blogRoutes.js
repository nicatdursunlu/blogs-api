const express = require('express')
const authMiddleware = require('../middleware/auth')
const blogController = require('../controllers/blog')

const blogRouter = express.Router()

blogRouter.use(authMiddleware)
blogRouter.get('/', blogController.getBlogList)
blogRouter.get('/:id', blogController.getSingleBlog)
blogRouter.post('/', blogController.insertBlog)
blogRouter.put('/:id', blogController.updateBlog)
blogRouter.delete('/:id', blogController.deleteBlog)

module.exports = blogRouter
