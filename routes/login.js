var express = require('express');
var sqlite3 = require('sqlite3');
var passport = require('passport');

var router = express.Router();


var db = new sqlite3.Database('./workspotter.sqlite3');


/* GET home page. */
router.get('/', function(req, res, next) {
    var msg = "";
    if (req.query.fail == '1') {
        msg = 'ログインできませんでした。ユーザー名かパスワードが不正です。';
    }
    res.render('login', { 'msg': msg });
});

router.get('/register_user', function(req, res, next) {
    res.redirect('/register_user');
});

//passport
router.use(passport.initialize());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done){
    db.get('SELECT * FROM user WHERE name = ?', username, function(err, row) {
        if (!row) {
            console.log("login fail");
            return done(null, false);
        }
        else {
            console.log("login success");
            return done(null, row);
        }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.post('/',
    passport.authenticate('local', {failureRedirect: '/login?fail=1'}), function (req, res) {
        if (req.user.isCompany == 1) {
            res.redirect('dashboard');
        } else {
            res.redirect('index');
        }
    }
);

module.exports = router;
