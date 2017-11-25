var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */

function showFreeTimeList(req, res, next) {
  var retv = db.all("select * from freetime", (err, row) => {
	  if(err){
		res.status(500).send({ error: 'db fail' });
		return;
	  }
  res.render('add_free_time', { freetimes: row });
  });
};

router.get('/', function(req, res, next) {
showFreeTimeList(req, res, next);
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	db.run("INSERT INTO freetime(userId, day, from_hour, from_minute, to_hour, to_minute) VALUES (?, ?, ?, ?, ?, ?)", [
		0,
		req.body.day,
		req.body.from_h,
		req.body.from_m,
	req.body.to_h,
	req.body.to_m]);
showFreeTimeList(req, res, next);
});


module.exports = router;
