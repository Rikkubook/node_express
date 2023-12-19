const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');


/* GET users listing. */
router.get('/', async (req, res) =>{
    try{
      const users =await User.find({});
      console.log(users)
      res.render('index',{
        title: '使用者列表',
        data: users
      })
    }catch(error){
      errorHandler(res,error,400)
    }
  console.log('index')
});

router.get('/success', async (req, res) =>{
  const message = req.query.message || '';
  res.render('success', {message})
});

module.exports = router;
