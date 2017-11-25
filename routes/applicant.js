var express = require('express');
var router = express.Router();

// db access;
var assign_json = {
    "user": {
        "name": "Takato Yamazaki",
        "rates": {
            "1" : {
                "category_id": "1",
                "rate": "1000000",
            },
        },
    },
    "category": {
        "1": {
            "name": "Programming",
        },
    },
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('applicant', assign_json);
});

module.exports = router;
