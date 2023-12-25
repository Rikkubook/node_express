const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');


router.get('/', postControl.getAllPosts);

router.post('/', postControl.postNewPost);

router.patch('/:id', postControl.patchPost);

router.delete('/', postControl.deleteAllPost);

router.delete('/:id', postControl.deletePost);

module.exports = router;
