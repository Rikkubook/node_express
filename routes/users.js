const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userControllers');

/* GET users listing. */
router.get('/', userControl.getAllUsers); //只是轉打的配置

router.post('/', userControl.postUser);

router.patch('/:id', userControl.patchUser);

router.delete('/', userControl.deleteAllUsers);

router.delete('/:id', userControl.deleteUser);

module.exports = router;
