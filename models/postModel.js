const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '請輸入您的userId']
  },
  content: {
    type: String,
    required: [true,"內文必填"]
  },
  image: String,
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  createAt: {
    type: Date,
    default: Date.now,
    select: true,
  },
},
{
  versionKey: false, // __v: 隱藏 // --V:0
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;