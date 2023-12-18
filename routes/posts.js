const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const Like = require('../models/likesModel')
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
    if(!data.userInfo || !data.content ){
      throw '名稱、內文、缺一不可'
    }
    const newPost = await Post.create({
        userInfo: data.userInfo,
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

router.delete('/', async (req, res) => {
  try{
    await Post.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});


//----------------------------------------------------------------

///???? 如果刪除文章時 收藏這邊要刪嗎?? 還是回傳此文章已刪就好

//新增-移除
router.post('/postLikes', async (req, res) => {
  try{
    const data = req.body
    if(!data.userInfo || !data.posts ){
      throw '使用者Id、喜歡文章Id、缺一不可'
    }

    const user = await Like.findOne({"userInfo": data.userInfo})
    const post = await Post.findOne({"_id": data.posts})

    if(user){
      if(user.posts.includes(data.posts)){ //移除
        const postsIndex = user.posts.indexOf(data.posts)
        user.posts.splice(postsIndex, 1) 
        user.save()

        // 移除時文章連動
        const likesIndex = post.likes.indexOf(data.userInfo)
        post.likes.splice(likesIndex, 1) 
        post.save()

        successHandler(res, user)
      }else{ //收藏
        user.posts.unshift(data.posts) 
        user.save()

        // 收藏時文章連動
        post.likes.unshift(data.userInfo) 
        post.save()
        successHandler(res, user)
      }
    }else{
      const newLike = await Like.create({
        userInfo: data.userInfo,
        posts: [data.posts],
      })
       // 收藏時文章連動
      post.likes.unshift(data.userInfo) 
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
    if(!data.userInfo ){
      throw '使用者Id缺一不可'
    }

    const likes = await Like.findOne({"userInfo": data.userInfo})
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
module.exports = router;
