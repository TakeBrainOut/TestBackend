var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/database');
var passport = require('passport');


var routes = require('./routes/index');
var tests = require('./routes/tests');
var partials = require('./routes/partials');
var subjects = require('./routes/subjects');
var signup = require('./routes/signup');
var auth = require('./routes/auth');
var userinfo = require('./routes/userinfo');
var users = require('./routes/users');
var upd = require('./routes/update');
var check = require('./routes/updCheck');
var fcmTokenRoute = require('./routes/fcmtokens');
var notification = require('./routes/notification');

var app = express();

require('./config/passport')(passport);

// mongodb driver

var mongoose = require('mongoose');
mongoose.connect(config.database, function(err){
  if(err) {
    console.log('MongoDB: connection error', err);
  } else {
    console.log('MongoDB: connection successful');
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use the passport package in our application
app.use(passport.initialize());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// get our request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/tests', tests);
app.use('/partials', partials);
app.use('/api/subjects', subjects);
app.use('/signup', signup);
app.use('/auth', auth);
app.use('/api/userinfo', userinfo);
app.use('/api/users', users);
app.use('/api/update', upd);
app.use('/api/check', check);
app.use('/api/fcmtokens/', fcmTokenRoute);
app.use('/api/notification', notification);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
