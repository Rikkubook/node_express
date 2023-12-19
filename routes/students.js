const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');

// 註冊畫面
router.get("/signup", async(req, res, next)=>{
  res.render('signup', { message: "" })
})
// 註冊API
router.post("/signup", async (req, res, next)=>{
  try{
    const data = req.body
    const {email} = data
    if(!data.name){
      throw '使用者名稱不為空'
    }else if(!data.email){
      throw 'Email不為空'
    }else if(!data.password){
      throw '密碼不為空'
    }

    let findUser = await User.findOne({email})
    if(findUser){
      throw '已有使用者'
    }

    await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    // 密碼驗證
    // bcrypt.genSalt(saltRounds,(err, salt) => {
    //   if(err){
    //     next(err)
    //   }
    //   console.log(salt)
    //   bcrypt.hash(password, salt, (err, hash) => {
    //     if(err){
    //       next(err)
    //     }
    //     console.log(hash)
    //     let newUser = new UserModal({username, hash})
    //     try{
    //       newUser.save().then(()=>{
    //         res.send({message: "newUser save into DB"})
    //       }).catch((e)=>{
    //         res.send(e)
    //       })
    //     }catch (err){
    //       next(err)
    //     }
    //   });
    // });
    res.redirect('/success?message=註冊');
  }catch(error){
    // errorHandler(res,error,400)
    res.render('signup', { message: error });
  }
})

// 登入畫面
router.get("/login", async(req, res, next)=>{
  res.render('login', { message: "" })
})
// 登入API
router.post("/login", async(req, res, next)=>{

  try{
    const data = req.body
    const {email} = data
    if(!data.email){
      throw 'Email不為空'
    }else if(!data.password){
      throw '密碼不為空'
    }

    let findUser = await User.findOne({email})
    if(findUser){
      // 密碼驗證
      // bcrypt.compareSync(password, foundUser.password, (err, result)=>{
      //   if(err){
      //     next(err)
      //   }
  
      //   if(result === true){
      //     req.session.isVerified = true;
      //     res.render("secret")
      //   }else{
      //     res.send("not correct")
      //   }
      // })
      res.redirect('/success?message=登入');
    } else{
      throw '尚未註冊'
    }

  } catch (err){
    res.render('signup');
  }
})


module.exports = router;