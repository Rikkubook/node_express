const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const Like = require('../models/likesModel')
const User = require('../models/userModel')
const { successHandler, errorHandler } = require('../handler');


router.get('/', async (req, res) => {
  // http://localhost:3005/posts?timeSort=asc&search=
  const timeSort = req.query.timeSort == 'asc'? 1:-1
  const search = req.query.search? {"content": new RegExp(req.query.search)} : {}; 
  try{
    const posts =await Post.find(search).populate({ //此是先將name編譯,可以不編譯只算長度
      path: 'userInfo',
      select: 'name photo'
    }).sort({'createAt': timeSort})  //.sort(timeSort)
    successHandler(res, posts)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/', async (req, res) => {
  try{
    const data = req.body
    if(!data.userID){
      throw '使用者ID不為空'
    }else if(!data.content){
      throw '內文不為空'
    }

    if(data.userID){ // 防止沒有使用者依然可以輸入
      const user =await User.findById(data.userID);
      if(!user){
        throw '沒有這位使用者'
      }
    }

    const newPost = await Post.create({
        userInfo: data.userID,
        image: data.image,
        content: data.content,
        likes: data.likes,
        comments: data.comments,
        createdAt: data.createdAt,
      })
    successHandler(res, newPost)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.patch('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const data = req.body

    if(!data.content){
      throw '內文不為空'
    }

    const resultPost = await Post.findByIdAndUpdate(id,data);
    if(resultPost == null){
      throw '查無此id'
    } // 會是找到那筆，但未修改

    const newData =await Post.findById(id);
    successHandler(res, newData)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await Post.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

//----------------------------------------------------------------


//新增-移除
router.post('/postLikes', async (req, res) => {
  try{
    const data = req.body
    if(!data.userID || !data.posts ){
      throw '使用者Id、喜歡文章Id、缺一不可'
    }

    const user = await Like.findOne({"userInfo": data.userID})
    const post = await Post.findOne({"_id": data.posts})

    if(user){
      if(user.posts.includes(data.posts)){ //移除
        const postsIndex = user.posts.indexOf(data.posts)
        user.posts.splice(postsIndex, 1) 
        user.save()

        // 移除時文章連動
        const likesIndex = post.likes.indexOf(data.userID)
        post.likes.splice(likesIndex, 1) 
        post.save()

        successHandler(res, user)
      }else{ //收藏
        user.posts.unshift(data.posts) 
        user.save()

        // 收藏時文章連動
        post.likes.unshift(data.userID) 
        post.save()
        successHandler(res, user)
      }
    }else{
      const newLike = await Like.create({
        userInfo: data.userID,
        posts: [data.posts],
      })
       // 收藏時文章連動
      post.likes.unshift(data.userID) 
      post.save()
      successHandler(res, newLike)
    }
  }catch(error){
    errorHandler(res,error,400)
  }
});

// 查詢
router.get('/likes', async (req, res) => {
  try{
    const data = req.body
    if(!data.userID ){
      throw '使用者Id缺一不可'
    }

    const likes = await Like.findOne({"userInfo": data.userID})
    .populate({ //此是先將userInfo 編譯
      path: 'userInfo',
      select: 'name photo'
    }).populate({ //此是先將posts 編譯
      path: 'posts',
      select: 'name content createAt'
    })

    successHandler(res, likes)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/likes', async (req, res) => {
  try{
    await Like.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const resultUser = await Post.findByIdAndDelete(id);
    if(resultUser == null){
      throw '查無此id'
    }
    const posts =await Post.find({});
    successHandler(res, posts)
  }catch(error){
    errorHandler(res,error,400)
  }
});
module.exports = router;
