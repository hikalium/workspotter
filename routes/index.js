var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if(req.user){
		console.log("loginned");
	} else{
		res.redirect('/login');
	}
	res.render('index', { title: 'Express' });
});


module.exports = router;
