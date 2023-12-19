const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '請輸入您的userId']
  },
  title:{
    type: String,
    required: [true, '請輸入內容']
  },
  completed: {
    type: Boolean,
    default: false
  }
},
{
  versionKey: false, // __v: 引藏
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;