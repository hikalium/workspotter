var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		console.log("loginned");
	} else{
		console.log("not logged in");
	}
  res.render('index', { title: 'Express' });
});


module.exports = router;
