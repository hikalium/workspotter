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
        var job = row[0];
        assign['job'] = job;

        strSQL = "SELECT * FROM reqrate INNER JOIN category ON categoryId = category.id WHERE jobId = " + jobId;
        db.all(strSQL, (err, rows) => {
            var data = rows[0];
            var a = job.payParamA;
            var b = job.payParamB;
            var c = job.payParamC;
            var r = data.reqRate;
            strSQL = "SELECT * FROM rate WHERE userId = " + req.user.id;
            db.all(strSQL, (err, rows2) => {
                var x = rows2[0].rate;
                var pay = 0;
                assign['reqrates'] = rows;
                if (x > b) pay = c;
                else pay = a+(c-a)/(b-r)*(x-r);
                assign['pay'] = pay;
                console.log(assign);
                res.render('job_info', assign);
            });
        });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    showJob(req, res, next);
});

module.exports = router;
