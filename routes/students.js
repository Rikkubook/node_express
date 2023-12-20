const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Student = require('../models/studentModel');
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
    res.render('signup', { message: error });
  }
})

// 學生列表畫面
router.get("/studentsList", async(req, res, next)=>{
  try{
    let data = await User.find()
    res.render('students/studentsList', { data });
  }catch{
    res.send({message:"Error with finding data"})
  }
})
// 個人資料畫面
router.get("/studentsList/:id", async(req, res, next)=>{
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
router.get("/studentInsert/:id", async(req, res, next)=>{
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
router.get("/studentEdit/:id", async(req, res, next)=>{
  try{
    let {id} =req.params
    let userData = await User.findById(id);
    let userInfo = await Student.findOne({"name": id});
    let data = {
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
router.get("/studentPage/:id", async(req, res, next)=>{
  try{
    let {id} =req.params
    console.log(id)
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
    res.status(404)
    res.send({message:"Error with finding data"})
    console.log(e)
  }
  res.render('students/studentPage',{})
})


// 個人新增API
router.post("/studentInsert/:id", async(req, res, next)=>{
  try{
    let {id} =req.params;
    let data = req.body;
    let userData = await User.findById(id);
    let newData = {
      name: userData.name,
      email: userData.email,
      age: data.age,
      major: data.major,
      scholarship: {
        merit: data.merit,
        other: data.other,
      }
    };
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
      res.render('students/studentPage',{student: newData})
    }else{
      throw '已有此位使用者資料'
    }

    console.log(newData)
    // if(!userInfo){
    //   res.redirect(`/students/studentInsert/${id}`)
    // }else{
    //   res.redirect(`/students/studentPage/${id}`)
    // }

  }catch(e){
    res.status(404)
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