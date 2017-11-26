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

    db.all("SELECT * FROM category", function (err, rows) {
        var categoryId = {};
        var categoryName = [];
        for(var i=0; i<rows.length; i++){
            categoryName.push(rows[i].name);

            categoryId[rows[i].name] = rows[i].id;
        }

        res.render('rate',{'applyId': applyId, 'categoryId': categoryId, 'categoryName': categoryName, 'title': '仕事の評価'});
    });
});

router.post('/', function(req, res, next){
    var applyId = req.body.applyId;
    delete req.body["applyId"];
    var eval = req.body;

    console.log(eval);

    db.get('SELECT * FROM apply WHERE id=?', applyId, function(err, row){
        var userId = row.userId;

        Object.keys(eval).forEach(function (key) {
            db.get('SELECT * FROM rate WHERE userId = ? AND categoryId = ?', [userId, key], function (err, row) {

            });
        });
    });
});

module.exports = router;
