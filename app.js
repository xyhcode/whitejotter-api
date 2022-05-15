var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');
const {PRIVATE_KEY}=require('./utils/constant');
const {expressjwt:expressJWT} = require("express-jwt");


var atricleRouter = require('./routes/atricle');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var menuRouter = require('./routes/menu');
var bannerRouter = require('./routes/banner');
var studentRouter = require('./routes/student');
var newRouter = require('./routes/new');
var orderRouter = require('./routes/order');
var messagesRouter = require('./routes/message')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJWT({
  //自定义的秘钥 constant.js
  secret:PRIVATE_KEY,
  algorithms: ["HS256"],
}).unless({
  path:[
    '/api/users/register',//白名单 除了这里的地址 其他URL都要验证
    '/api/users/login',
    '/api/article/img/upimg',
    '/api/books',
    /^\/api\/article\/.*/,
      '/menu/authentication'
  ]
}))

app.use('/api/menu',menuRouter);
app.use('/api/article', atricleRouter);
app.use('/api/books',booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/student', studentRouter);
app.use('/api/new', newRouter);
app.use('/api/order',orderRouter)
app.use('/api/message',messagesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //token出现异常
  if (err.name === 'UnauthorizedError') {
    // 这个需要根据⾃自⼰己的业务逻辑来处理理
    res.status(401).send({code:401,msg:'token验证错误！'});
  }else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
