var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');


router.post('/', function(req, res, next) {
	if(!req.body.id){
			console.log("jobid not set");
		res.redirect("/error");
		return;
	}
	if(!req.user || !req.user.id){
			console.log("user not logged in");
		res.redirect("/error");
		return;
	}
	db.run("INSERT INTO apply(userId, jobId, status) VALUES(?, ?, 0)",
		[req.user.id, req.body.id],
	function(err){
		if(!err){
			res.redirect("/index?status=apply_success");
			return;
		}
		console.log("DB error " + err);
		res.redirect("/error");
	});
});

module.exports = router;
