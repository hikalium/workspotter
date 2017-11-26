var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.user){
  	res.redirect("/login");
	return;
  }
  db.all("select * from freetime where userId = ?", [req.user.id], (err, ft) => {
	  if(err){
		res.status(500).send({ error: 'db fail' });
		return;
	  }
	  db.all("select * from job", (err, jb) => {
		  if(err){
			  res.status(500).send({ error: 'db fail' });
			  return;
		  }
		  res.render('index', { freetimes: ft, jobs: jb });
	  });
  });
});


module.exports = router;
