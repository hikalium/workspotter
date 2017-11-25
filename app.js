var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//
var app = express();
// auth
var passport = require('passport');
app.use(require('express-session')({
	  secret: 'keyboard cat',
	    resave: true,
		  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
function isAuthenticated(req, res, next){
	if (req.isAuthenticated()) {  // 認証済
		return next();
	}
	else {  // 認証されていない
		res.redirect('/login');  // ログイン画面に遷移
	}
}
//
passport.serializeUser(function(user, done) {
	    done(null, user);
});
passport.deserializeUser(function(user, done) {
	    done(null, user);
});
// pages
var root = require('./routes/root');
var index = require('./routes/index');
var register_user = require('./routes/register_user');
var login = require('./routes/login');
var user_edit = require('./routes/user_edit');
var job_info = require('./routes/job_info');
var apply_done = require('./routes/apply_done');
var register_company = require('./routes/register_company');
var applicant = require('./routes/applicant');
var rate = require('./routes/rate');
var dashboard = require('./routes/dashboard');
var company_edit = require('./routes/company_edit');
var job_edit = require('./routes/job_edit');
var admin = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', root);
// admin
app.use('/admin', admin);
// user side
app.use('/login', login);
app.use('/index', index);
app.use('/register_user', register_user);
app.use('/user_edit', user_edit);
app.use('/job_info', job_info);
app.use('/apply_done', apply_done);
// company side
app.use('/register_company', register_company);
app.use('/applicant', applicant);
app.use('/rate', rate);
app.use('/dashboard', dashboard);
app.use('/company_edit', company_edit);
app.use('/job_edit', job_edit);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
