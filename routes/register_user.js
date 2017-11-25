var express = require('express');
var sqlite3 = require('sqlite3');

var router = express.Router();

var db = new sqlite3.Database('./workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register_user');
});


router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var isCompany = (req.body.isCompany)? 1: 0;

    db.get('SELECT * FROM user WHERE name = ?', username, function(err, row) {
        if (!row) {
            db.run('INSERT INTO USER(name, password, isCompany) VALUES(?, ?, ?)', username, password, isCompany);
            console.log("User " + username + " added");

            res.redirect("/login");
        }
        else {
            console.log("User " + username + " already exist");

            res.redirect("/register_user");
        }
    });
});

module.exports = router;
