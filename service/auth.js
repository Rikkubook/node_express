const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // 產生 JWT token
	//1.簽名放 {id:user._id}
	//2.放金鑰
	//3.過期日
  const token = jwt.sign(  //先簽名 
		{id:user._id},//body 顯示要顯示的"非重要"資訊
		process.env.JWT_SECRET, // 混淆碼
		{expiresIn: process.env.JWT_EXPIRES_DAY} //有效日
	);
  return token;
}
const isAuth = function(req, res, next){
  // 確認 token 是否存在
  const token = req.signedCookies.user_session;
  if (!token) {
    // 如果沒有 token，返回未授權
    return res.status(401).json({ message: '未授權' });
  }

  try {
    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 將解碼後的用戶信息添加到 req 中，以便後續的中間件和路由可以使用
    req.user = decoded;  // 可以透過這個藏 id 去打下一個需要的直
    next(); // 繼續處理下一個中間件或路由
  } catch (error) {
    // 如果 token 無效，返回未授權
    return res.status(401).json({ message: '未授權' });
  }
}


module.exports = {
  generateToken,
  isAuth,
}