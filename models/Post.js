const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  vacation: {
    type: Number
  },
  beginDate: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('posts', postSchema)
