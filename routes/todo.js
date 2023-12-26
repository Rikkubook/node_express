const express = require('express');
const router = express.Router();
const todoControl = require('../controllers/todoControllers');

/* GET users listing. */
router.get('/', todoControl.getAllTodo);

router.post('/', todoControl.postTodo);

router.patch('/:id', todoControl.patchTodo);

router.delete('/', todoControl.deleteAllTodo);

router.delete('/:id', todoControl.deleteTodo);

module.exports = router;