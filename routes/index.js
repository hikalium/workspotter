var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  var retv = db.get("select * from freetime", (err, row) => {
	  if(err){
	  	console.log("Error:" + err);
	  } else{
  	console.log(row);
	  }
  });
  res.render('index', { title: 'Express' });
});


module.exports = router;
