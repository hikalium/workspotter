var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.all("select * from job", (err, row) => {
        if(err){
            res.status(500).send({ error: 'db fail' });
            return;
        }

        console.log(row);

        res.render('dashboard', { });
    });

    //res.render('dashboard', {});
});

module.exports = router;
