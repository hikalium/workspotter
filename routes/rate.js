var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

function getRate(curRate, reqRate, jobEval){
  return curRate;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var applyId = req.query.applyId;
  var categorys = [];
  db.serialize(function(){
    db.each("SELECT * FROM category", function (err, row) {
      categorys.push(row.name);
    });
    res.render('rate',{'applyId': applyId, 'categorys': categorys});
  });
});

router.post('/', function(req, res, next){
  var applyId = req.query.applyId;
  var eval = req.body.eval;
  var jobId;
  var userId;

  db.serialize(function(){
    db.all('SELECT * FROM apply WHERE id=?',applyId,function(err,rows){
      jobId = rows[0].jobId;
      userId = rows[0].userId;
    });
    var sqlstr = "";
    sqlstr += 'SELECT * FROM category ';
    sqlstr += 'INNER JOIN reqrate ON categoryId=category.id AND jobId=? ';
    sqlstr += 'INNER JOIN rate ON categoryId=category.id AND userId=?';

    var stmt = db.prepare("INSERT INTO jobeval(applyId, categoryId, eval) VALUES (?, ?, ?)");
    db.each(sqlstr,jobId,userId,function (err, row) {
      stmt.run(applyId, row.id, eval);
      db.run("UPDATE rate SET rate=? WHERE userId=? AND categoryId=?",getRate(row.rate, row.reqRate,eval),userId,row.id);
    });
    stmt.finalize();

    res.redirect('/dashboard?status=eval_complete');
  });
});

module.exports = router;
