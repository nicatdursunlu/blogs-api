const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  title: String,
  author: {
    type: 'ObjectId',
    ref: 'users',
  },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favorites: Number,
  },
})

const BlogModel = mongoose.model('blogs', BlogSchema)

module.exports = BlogModel
