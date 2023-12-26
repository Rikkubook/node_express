const Post = require('../models/postModel');
const Like = require('../models/likesModel');
const { successHandler, errorHandler } = require('../handler');

const likeControl = {
  getLikes:
    // 某人的所有喜歡
    async (req, res) => {
      try{
        const id = req.params.id;

        const likes = await Like.findOne({"userInfo": id})
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
    },
  postPageLike:
    async (req, res) => {
      try{
        const id = req.params.id;
        const data = req.body
        if( !data.posts ){
          throw '喜歡文章ID不為空'
        }

        const user = await Like.findOne({"userInfo": id})
        const post = await Post.findOne({"_id": data.posts})

        if(user){
          if(user.posts.includes(data.posts)){
            throw '已有點讚此文章'
          }else{
            user.posts.unshift(data.posts) 
            user.save()
    
            // 收藏時文章連動
            post.likes.unshift(data.userID) 
            post.save()
            successHandler(res, user)
          }
        }else{
          const newLike = await Like.create({
            userInfo: id,
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
    },
  deletePageLike:
    async (req, res) => {
      try{
        const id = req.params.id;
        const data = req.body
        if( !data.posts ){
          throw '喜歡文章ID不為空'
        }
    
        const user = await Like.findOne({"userInfo": id})
        const post = await Post.findOne({"_id": data.posts})
    
        console.log(user)
        if(user && user.posts.includes(data.posts)){
          const postsIndex = user.posts.indexOf(data.posts)
          user.posts.splice(postsIndex, 1) 
          user.save()
  
          // 移除時文章連動
          const likesIndex = post.likes.indexOf(data.userID)
          post.likes.splice(likesIndex, 1) 
          post.save()
  
          successHandler(res, user)
        }else{
          throw '驗證錯誤'
        }
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deleteLike:
    // 刪除某人的所有喜歡
    async (req, res) => {
      try{
        const id = req.params.id;
        await Like.deleteOne({ "userInfo": id });
        successHandler(res, [])
      }catch(error){
        errorHandler(res,error,400)
      }
    },
}

module.exports = likeControl;