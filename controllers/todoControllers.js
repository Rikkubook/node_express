const Todo = require('../models/todoModel')
const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');

const todoControl ={
  getAllTodo:
    async (req, res) => {
      try{
        const todoList =await Todo.find({});
        successHandler(res, todoList)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  postTodo:
    async (req, res) => {
      try{
        const data = req.body
    
        if(!data.userID){
          throw '使用者ID不為空'
        }else if(!data.title){
          throw '內文不為空'
        }
    
        if(data.userID){ // 防止沒有使用者依然可以輸入
          const user =await User.findById(data.userID);
          if(!user){
            throw '沒有這位使用者'
          }
        }
      
        const TodoItem = await Todo.create({
          userInfo: data.userID,
          title: data.title,
        })
        successHandler(res, TodoItem)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  patchTodo:
    async (req, res) => {
      try{
        const id = req.params.id;
        const data = req.body
    
        if(!data.title){
          throw '內文不為空'
        }
        if(data.completed){
          data.completed = Boolean(data.completed)
        }
    
        const resultUser = await Todo.findByIdAndUpdate(id,data);
        console.log(resultUser)
        if(resultUser == null){
          throw '查無此id'
        } // 會是找到那筆，但未修改
    
        const newData =await Todo.findById(id);
        successHandler(res, newData)
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deleteAllTodo:
    async (req, res) => {
      try{
        await Todo.deleteMany({});
        successHandler(res, [])
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deleteTodo:
    async (req, res) => {
      try{
        const id = req.params.id;
        const resultUser = await Todo.findByIdAndDelete(id);
        if(resultUser == null){
          throw '查無此id'
        }
        const todoList =await Todo.find({});
        successHandler(res, todoList)
      }catch(error){
        errorHandler(res,error,400)
      }
    }
}

module.exports = todoControl;