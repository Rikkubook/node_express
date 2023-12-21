const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const { successHandler, errorHandler } = require('../handler');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { generateToken, isAuth } = require('../service/auth')

// 註冊畫面
router.get("/signUp", async(req, res, next)=>{
  res.render('signUp', { message: "" })
})
// 註冊API
router.post("/signUp", async (req, res, next)=>{
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


    if(!validator.isLength(data.name,{min:2})){
      throw "暱稱兩字以上"
    }
    if(!validator.isLength(data.password,{min:8})){
      throw "密碼不可小於 8 碼"
    }

    let findUser = await User.findOne({email})
    if(findUser){
      throw '已有使用者'
    }

    data.password = await bcrypt.hash(data.password,3)

    const newUser =await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    const token = generateToken(newUser);
    res.cookie("user_session",token, { httpOnly: true }); //寫入給前端 cookie
    res.redirect(`/students/studentsList`);
  }catch(error){
    // errorHandler(res,error,400)
    res.render('signUp', { message: error });
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
    if(!data.email){
      throw 'Email不為空'
    }else if(!data.password){
      throw '密碼不為空'
    }

    const user = await User.findOne({ email: data.email }).select('+password')  // 為了要把預設不顯示的取出，添加+
    if(user){
      // 密碼驗證
      await bcrypt.compare(data.password, user.password, (err, result) => {
        if(err){
          next(err)
        }
        if(result === true){
          const token = generateToken(user);
          res.cookie("user_session",token, { httpOnly: true });
          res.redirect(`/students/studentsList`);
        }else{
          next(err)
        }
      })
      
    } else{
      throw '尚未註冊'
    }

  } catch (err){
    console.log('err')
    res.render('signUp', { message: err });
  }
})

// 學生列表畫面
router.get("/studentsList", isAuth, async(req, res, next)=>{
  try{
    let data = await User.find()
    res.render('students/studentsList', { data });
  }catch{
    res.send({message:"Error with finding data"})
  }
})
// 個人資料畫面
router.get("/studentsList/:id", isAuth, async(req, res, next)=>{
  try{
    let {id} =req.params
    let userData = await User.findById(id);
    let userInfo = await Student.findOne({"name": id});

    if(!userData){
      res.send({message:"無此使用者"})
    }
    if(!userInfo){
      res.redirect(`/students/studentInsert/${id}`)
    }else{
      res.redirect(`/students/studentPage/${id}`)
    }

  }catch(e){
    res.status(404)
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})
// 個人新增畫面
router.get("/studentInsert/:id", isAuth, async(req, res, next)=>{
  try{
    let {id} =req.params
    let userData = await User.findById(id);
    let data = {
      id: id,
      name: userData.name,
      email: userData.email,
    };
    res.render('students/studentInsert',{student: data})
    }catch(e){
      res.status(404)
      res.send({message:"Error with finding data"})
      console.log(e)
    }
})
// 個人編輯畫面
router.get("/studentEdit/:id", isAuth, async(req, res, next)=>{
  try{
    let {id} =req.params
    let userData = await User.findById(id);
    let userInfo = await Student.findOne({"name": id});
    let data = {
      id: id,
      name: userData.name,
      email: userData.email,
      age: userInfo.age,
      major: userInfo.major,
      scholarship:　userInfo.scholarship,
    };
    res.render('students/studentEdit',{student: data})
  }catch(e){
    res.status(404)
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})
// 個人呈現畫面
router.get("/studentPage/:id", isAuth, async(req, res, next)=>{
  try{
    let {id} =req.params
    let userData = await User.findById(id);
    let userInfo = await Student.findOne({"name": id});
    let data = {
      id: id,
      name: userData.name,
      email: userData.email,
      age: userInfo.age,
      major: userInfo.major,
      scholarship:　userInfo.scholarship,
    };
    res.render('students/studentPage',{student: data})
  }catch(e){
    res.send({message:"Error with finding data"})
  }
})


// 個人新增API
router.post("/studentInsert/:id", async(req, res, next)=>{
  try{
    let {id} =req.params;
    let data = req.body;

    const userInfo =await Student.findOne({"name": id});

    // 沒有才新增
    if(!userInfo){
        await Student.create({
        name: id,
        age: data.age,
        major: data.major,
        scholarship: {
          merit: data.merit,
          other: data.other,
        },
      })
      res.redirect(`/students/studentPage/${id}`)
    }else{
      throw '已有此位使用者資料'
    }
  }catch(e){
    res.status(404)
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})
// 個人修改API
router.post("/studentEdit/:id", async(req, res, next)=>{
  try{
    let {id} =req.params;
    let data = req.body;
    let newData = {};
  
    const newArray = Object.entries(data)
    newArray.filter((item)=> {
      if(item[1]){
        newData[item[0]] = item[1]
      }
    })

    const resultPage = await Student.findOneAndUpdate({"name": id}, newData)
    if(resultPage == null){
      throw '查無此id'
    }

    res.redirect(`/students/studentPage/${id}`)

  }catch(e){
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})
// 個人刪除API
router.get("/studentDelete/:id", async(req, res, next)=>{
  try{
    const id = req.params.id
    const user =await User.findById(id);
    if(!user){
      throw '沒有這位使用者'
    }
    const resultUser = await User.findByIdAndDelete(id)

    res.redirect(`/students/studentsList`)

  }catch(e){
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})

//------------------------------------

// 個人資料API CRUD
router.get('/', async (req, res) => {
  try{
    const studentPage = await Student.find({})
    successHandler(res, studentPage)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.get('/:id', async (req, res) => {
  try{
    const id = req.params.id
    const studentPage = await Student.findOne({"name": id});
    successHandler(res, studentPage)
  }catch(error){
    errorHandler(res,error,400)
  }
});
router.post('/:id', async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body

    const user =await User.findById(id);
    if(!user){
      throw '沒有這位使用者'
    }

    const userInfo =await Student.findOne({"name": id});

    // 沒有才新增
    if(!userInfo){
      const newStudentPage = await Student.create({
        name: id,
        age: data.age,
        major: data.major,
        scholarship: data.scholarship,
      })
      successHandler(res, newStudentPage)
    }else{
      throw '已有此位使用者'
    }
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.patch('/:id', async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body

    const user =await User.findById(id);
    if(!user){
      throw '沒有這位使用者'
    }

    const resultPage = await Student.findOneAndUpdate({"name": id}, data)
    if(resultPage == null){
      throw '查無此id'
    }
    const newData =await Student.findOne({"name": id});
    successHandler(res, newData)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await Student.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id
    const user =await User.findById(id);
    if(!user){
      throw '沒有這位使用者'
    }

    const resultPage = await Student.findOneAndDelete({"name": id})
    if(resultPage == null){
      throw '查無此id'
    }
    const studentPages =await Student.find({});
    successHandler(res, studentPages)
  }catch(error){
    errorHandler(res,error,400)
  }
});

module.exports = router;