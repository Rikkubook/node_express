const express = require('express');
const router = express.Router();
const likeControl = require('../controllers/likeControllers');


// 查詢
router.get('/:id', likeControl.getLikes);

router.post('/page/:id', likeControl.postPageLike);

router.delete('/page/:id', likeControl.deletePageLike);

router.delete('/:id', likeControl.deleteLike);

module.exports = router;