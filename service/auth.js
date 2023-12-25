
const isAuth = function(req, res, next){
  if(req.session.isVerify){
    next(); // 繼續處理下一個中間件或路由
  }else{
    req.flash('error', '未授權');
    res.redirect('/students/errorPage');
  }

}


module.exports = {
  isAuth,
}