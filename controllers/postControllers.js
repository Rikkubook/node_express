const Post = require('../models/postModel');
const User = require('../models/userModel');
const { successHandler, errorHandler } = require('../handler');

const postControl = {
  getAllPosts:
    async (req, res) => {
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
    },
  postNewPost:
    async (req, res) => {
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
    },
  patchPost:
    async (req, res) => {
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
    },
  deleteAllPost:
    async (req, res) => {
      try{
        await Post.deleteMany({});
        successHandler(res, [])
      }catch(error){
        errorHandler(res,error,400)
      }
    },
  deletePost:
    async (req, res) => {
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
    }
}

module.exports = postControl;