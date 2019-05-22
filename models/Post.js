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
    type: Number,
    value: null
  },
  beginDate: {
    type: Date,
    value: null
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('posts', postSchema)
