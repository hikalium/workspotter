var express = require('express');
var sqlite3 = require('sqlite3');
var passport = require('passport');

var router = express.Router();


var db = new sqlite3.Database('');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {});
});

//passport
router.use(passport.initialize());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done){
    console.log(username + " " + password);
}));

router.post('/test',
    passport.authenticate('local', {
        failureRedirect: '/◆◆',  // 失敗したときの遷移先
    }),
    function(req, res){
        //成功時
    }
);

module.exports = router;
