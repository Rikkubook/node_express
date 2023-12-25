const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');

const userControl ={
  getAllUsers:
    async (req, res) => {
      try{
        const users =await User.find({});
        successHandler(res, users)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  postUser:
    async (req, res) => {
      try{
        const data =req.body
    
        if(!data.name){
          throw '使用者名稱不為空'
        }else if(!data.email){
          throw 'Email不為空'
        }else if(!data.password){
          throw '密碼不為空'
        }
    
        const newUser =await User.create({
          name: data.name,
          email: data.email,
          photo: data.photo,
          password: data.password
        });
        successHandler(res, newUser)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  patchUser:
    async (req, res) => {
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
        successHandler(res, newData)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deleteAllUsers:
    async (req, res) => {
      try{
        await User.deleteMany({});
        successHandler(res, [])
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deleteUser:
    async (req, res) => {
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
    }
}

module.exports = userControl;