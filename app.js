var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var authenticate = require("./auth");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const config = require("./config");

var app = express();
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
const mongoose = require("mongoose");
mongoose.set('debug',true);
const url = config.mongoUrl;
console.log(url)
const connect =  mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());


var indexRouter = require('./routes/index');
var usersRouter = require("./routes/usersRouter");
var ratingRouter = require("./routes/ratingRouter"); 
var applistRouter = require("./routes/applistRouter"); 
var favouriteRouter = require("./routes/favouriteRouter"); 
var contectRouter = require("./routes/contectRouter"); 
var testRouter = require("./routes/testRouter"); 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rating', ratingRouter); 
app.use('/applist', applistRouter); 
app.use('/favourite', favouriteRouter); 
app.use('/contect', contectRouter); 
app.use('/test', testRouter); 

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
