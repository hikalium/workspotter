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
    var categorys = [];
    for(var i=0; i<rows.length; i++){
      categorys.push(rows[i].name);
    }
    res.render('rate',{'applyId': applyId, 'categorys': categorys, 'title': '仕事の評価'});
  });
});

router.post('/', function(req, res, next){
  var applyId = req.query.applyId;
  var eval = req.body.eval;

  db.all('SELECT * FROM apply WHERE id=?',applyId,function(err,rows){
    var jobId = rows[0].jobId;
    var userId = rows[0].userId;

    var sqlstr = "";
    sqlstr += 'SELECT * FROM category ';
    sqlstr += 'INNER JOIN reqrate ON categoryId=category.id AND jobId=? ';
    sqlstr += 'INNER JOIN rate ON categoryId=category.id AND userId=?';

    db.serialize(function(){
      var stmt = db.prepare("INSERT INTO jobeval(applyId, categoryId, eval) VALUES (?, ?, ?)");
      db.each(sqlstr,jobId,userId,function (err, row) {
        stmt.run(applyId, row.id, eval);
        db.run("UPDATE rate SET rate=? WHERE userId=? AND categoryId=?",getRate(row.rate, row.reqRate,eval),userId,row.id);
      });
      stmt.finalize();
    });
  
    res.redirect('/dashboard?status=eval_complete');
  });
});

module.exports = router;
