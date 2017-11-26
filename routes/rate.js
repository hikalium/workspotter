var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./workspotter.sqlite3');

function getRate(curRate, reqRate, jobEval){
    return curRate;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var applyId = req.query.applyId;

    db.all("SELECT * FROM apply WHERE id = ?", applyId, function (err, row) {
        db.all("SELECT * FROM reqrate WHERE jobId = ?", row[0].jobId, function (err, reqrateRow) {
            db.all("SELECT * FROM category WHERE id = ?", reqrateRow[0].categoryId, function (err, cRow) {
                var categoryId = {};
                var categoryName = [];

                categoryId[cRow[0].name] = cRow[0].id;
                categoryName.push(cRow[0].name);

                console.log(categoryId);
                console.log(categoryName);

                res.render('rate',{'applyId': applyId, 'categoryId': categoryId, 'categoryName': categoryName, 'title': '仕事の評価'});
            });
        });
    });


    // db.all("SELECT * FROM category", function (err, rows) {
    //     var categoryId = {};
    //     var categoryName = [];
    //     for(var i=0; i < rows.length; i++){
    //         categoryName.push(rows[i].name);
    //
    //         categoryId[rows[i].name] = rows[i].id;
    //     }
    //
    //     res.render('rate',{'applyId': applyId, 'categoryId': categoryId, 'categoryName': categoryName, 'title': '仕事の評価'});
    // });
});

router.post('/', function(req, res, next){
    var applyId = req.body.applyId;
    delete req.body["applyId"];
    var eval = req.body;

    db.run("UPDATE apply set status = 3 WHERE id = ?", applyId);

    db.get('SELECT * FROM apply WHERE id=?', applyId, function(err, row){
        var userId = row.userId;
        var jobId = row.jobId;

        db.get('SELECT * FROM rate WHERE userId = ?', userId, function (err, rateRows) {
            db.get('SELECT * FROM job WHERE id = ?', jobId, function (err, jobRow) {
                var k = 0.2

                console.log(rateRows);

                var categoryId = rateRows.categoryId;
                var rate = rateRows.rate;

                console.log(eval[categoryId]);
                if (eval[categoryId]) {
                    var newrate = 0.1 * (jobRow.payParamC + (10 - parseInt(eval[categoryId])) * rate) * k + (1.0 - k) * rate
                    console.log(newrate);

                    db.run('INSERT INTO RATE(userId, categoryId, rate, created_at) VALUES(?, ?, ?, datetime(\'now\', \'localtime\'))', [
                        userId,
                        categoryId,
                        newrate
                    ]);
                }

                res.redirect("/dashboard?status=rate_complete");

                // rateRows.forEach(function (e) {
                //     if (eval[e.categoryId]) {
                //
                //         newrate = 0.1 * (jobRow.payParamC + (10 - eval[e.categoryId]) * e.rate) * k + (1.0 - k) * e.rate
                //
                //         db.run('INSERT INTO RATE(userId, categoryId, rate, created_at) VALUES(?, ?, ?, ?)', [
                //             userId,
                //             e.categoryId,
                //             newrate,
                //             datetime('now', 'localtime')
                //         ]);
                //
                //     }
                // });
            });
        });
    });
});

module.exports = router;
