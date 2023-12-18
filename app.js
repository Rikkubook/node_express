var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //接到 cookie
var logger = require('morgan'); // 日誌
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

const DB =  process.env.DATABASE_COMPASS.replace('<password>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(()=>{
  console.log('資料庫連線成功')
}).catch((error)=>{
  console.log(error)
})

var indexRouter = require('./routes/index')
var postsRouter = require('./routes/posts'); //管理Router
var usersRouter = require('./routes/users'); //管理Router

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //載入ejs

// 載入設定檔
app.use(logger('dev'));
app.use(express.json());  //app.use(bodyParser.json()); //組裝傳入的資料
app.use(express.urlencoded({ extended: false })); //app.use(bodyParser.urlencoded({ extended: false }));  // ???
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 預定靜態路由 使ejs 可以使用圖片等

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);


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
