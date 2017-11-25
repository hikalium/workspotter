


var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', {});

db.run("INSERT INTO user(name, password, isCompany) VALUES (?, ?, ?)", [
		"TakatoYamazaki",
		"takatakatenten",
		0]);
db.run("INSERT INTO user(name, password, isCompany) VALUES (?, ?, ?)", [
		"MenG",
		"menmenGG",
		0]);
});

module.exports = router;
