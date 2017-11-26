var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

function showJob(req, res, next) {
    var jobId = req.query.id;
    var assign = {};
    var strSQL = "SELECT * FROM job WHERE id = " + jobId;
    db.all(strSQL, (err, row) => {
        if(err){
            res.status(500).send({ error: 'db fail' });
            return;
        }
        assign['job'] = row[0];
        console.log(assign);
        res.render('job_info', assign);
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    showJob(req, res, next);
});

module.exports = router;
