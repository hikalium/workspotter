var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if(req.user){
		if(req.user.isCompany){
			res.redirect("/dashboard");
			return;
		} else{
			res.redirect("/index");
			return;
		}
	}
	res.redirect("/login");
});


module.exports = router;
