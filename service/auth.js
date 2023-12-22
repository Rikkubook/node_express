
const isAuth = function(req, res, next){
  if(req.session.isVerify){
    next(); // 繼續處理下一個中間件或路由
  }else{
    return res.status(401).json({ message: '未授權' });
  }

}


module.exports = {
  isAuth,
}