const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字']
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: false,
    select: false // 不顯示
  },
  photo: String,
},{
  versionKey: false, // __v: 隱藏 // --V:0
});

const User = mongoose.model('User', userSchema);

module.exports = User;