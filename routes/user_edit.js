var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */

function showFreeTimeList(req, res, next) {
  var retv = db.all("select * from freetime where userId = ?",[req.user.id], (err, row) => {
	  if(err){
		res.status(500).send({ error: 'db fail' });
		return;
	  }
  res.render('add_free_time', { freetimes: row });
  });
};

router.get('/', function(req, res, next) {
	if(!req.user || !req.user.id){
		res.redirect("/login");
		return;
	}
	showFreeTimeList(req, res, next);
});

router.post('/', function(req, res, next) {
	if(!req.user || !req.user.id){
		res.redirect("/login");
		return;
	}
	console.log(req.body);
	db.run("INSERT INTO freetime(userId, day, timecode_from, timecode_to) VALUES (?, ?, ?, ?)", [
		req.user.id,
		req.body.day,
		req.body.from_h * 60 + 
		parseInt(req.body.from_m),
	req.body.to_h * 60 +
	parseInt(req.body.to_m)]);
	console.log([req.body.from_h * 60 +req.body.from_m, req.body.to_h * 60 + req.body.to_m])
	console.log([req.body.from_h, req.body.from_m, req.body.to_h, req.body.to_m])
showFreeTimeList(req, res, next);
});


module.exports = router;
