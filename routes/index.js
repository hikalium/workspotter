var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res) {
  var retv = db.all("select * from freetime", (err, row) => {
	  if(err){
		res.status(500).send({ error: 'db fail' });
		return;
	  }
  	res.render('index', { freetimes: row });
  });
});


module.exports = router;
