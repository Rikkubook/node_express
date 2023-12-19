const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel')
const { successHandler, errorHandler } = require('../handler');

/* GET users listing. */
router.get('/', async (req, res) => {
  try{
    const todoList =await Todo.find({});
    successHandler(res, todoList)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/', async (req, res) => {
  try{
    const data = req.body

    if(!data.userID){
      throw '使用者ID不為空'
    }else if(!data.title){
      throw '內文不為空'
    }
    const TodoItem = await Todo.create({
      userInfo: data.userID,
      title: data.title,
    })
    successHandler(res, TodoItem)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.patch('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const data = req.body

    if(!data.userID){
      throw '使用者ID不為空'
    }else if(!data.title){
      throw '內文不為空'
    }
    if(data.completed){
      data.completed = Boolean(data.completed)
    }

    const resultUser = await Todo.findByIdAndUpdate(id,data);
    console.log(resultUser)
    if(resultUser == null){
      throw '查無此id'
    }
  
    successHandler(res, resultUser)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await Todo.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/:id', async (req, res) => {
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
});

module.exports = router;