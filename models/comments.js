const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    blog: {
      type: 'ObjectId',
      ref: 'blogs',
    },
    author: {
      type: 'ObjectId',
      ref: 'users',
    },
    content: String,
  },
  {
    timestamps: true,
  }
)

const CommentModel = mongoose.model('comments', CommentSchema)

module.exports = CommentModel
l
