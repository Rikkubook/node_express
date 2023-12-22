var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan'); // 日誌
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});
const session = require('express-session');

const DB =  process.env.DATABASE_COMPASS.replace('<password>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(()=>{
  console.log('資料庫連線成功')
}).catch((error)=>{
  console.log(error)
})

//管理RouterAPI
var postsRouter = require('./routes/posts'); 
var usersRouter = require('./routes/users');
var todoRouter = require('./routes/todo');
//渲染頁面用
var studentsRouter = require('./routes/students');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //載入ejs

// 載入設定檔
app.use(logger('dev'));
app.use(express.json());  //app.use(bodyParser.json()); //組裝傳入的資料
app.use(express.urlencoded({ extended: false })); //app.use(bodyParser.urlencoded({ extended: false }));  // ???
app.use(express.static(path.join(__dirname, 'public'))); // 預定靜態路由 使ejs 可以使用圖片等

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
	cookie: { 
    secure: false, // 如果使用 HTTPS，设置为 true
    maxAge: process.env.SESSION_EXPIRES_DAY, // (目前1小時）
  }
}));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/todo', todoRouter);
app.use('/students', studentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
