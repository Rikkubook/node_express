const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');

/* GET users listing. */
router.get('/', async (req, res) => {
  try{
    const users =await User.find({});
    successHandler(res, users)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/', async (req, res) => {
  try{
    const data =req.body
    console.log(data)
    if(!data.name || !data.email){
      throw '名字/Email為必填'
    }
    const newPost =await User.create({
      name: data.name,
      email: data.email,
      photo: data.photo
    });
    successHandler(res, newPost)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.patch('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const data = req.body
    const newArray = Object.keys(data)

    if(newArray.includes('name') && !data.name){
      throw '名字不為空'
    }else if(newArray.includes('email') && !data.email){
      throw 'Email不為空'
    }

    const resultUser = await User.findByIdAndUpdate(id,data);
    if(resultUser == null){
      throw '查無此id'
    }
    const newData =await User.findById(id);
    console.log(newData)
    successHandler(res, newData)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await User.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const resultUser = await User.findByIdAndDelete(id);
    if(resultUser == null){
      throw '查無此id'
    }
    const users =await User.find({});
    successHandler(res, users)
  }catch(error){
    errorHandler(res,error,400)
  }
});

module.exports = router;
