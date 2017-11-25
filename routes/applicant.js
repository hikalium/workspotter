var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

const NOT_EVALUATED = 0;
const ACCEPTED = 1;
const REJECTED = 2;

// POST
function submitted(req, res, next) {
  var data = req.body;
  console.log(data);
  var status = data.status;
  var applyId = data.applyId;
  var strSQL = "";
  strSQL += "UPDATE apply SET status = ? WHERE id = " + applyId;
  db.run(strSQL, status);
  res.redirect('/dashboard?status=apply_complete');
}

router.post('/', function(req, res, next) {
  submitted(req, res, next);
});

// GET
function showApplicant(req, res, next) {
  var assign = {};
  var applyId = req.query.applyId;
  assign['applyId'] = applyId;

  var strSQL = "";
  strSQL += "SELECT * FROM apply WHERE id = " + applyId;
  db.all(strSQL, (err, row) => {
    if (err) {
      res.status(500).send({ error: 'db fail1' });
      return;
    }
    var userId = row[0].userId;
    var jobId = row[0].jobId;

    strSQL = "SELECT * FROM user WHERE id = " + userId;
    db.all(strSQL, (err, row) => {
      if (err) {
        res.status(500).send({ error: 'db fail2' });
        return;
      }
      assign['user'] = row[0];

      strSQL = "SELECT * FROM rate WHERE userId = " + userId;
      db.all(strSQL, (err, row) => {
        if (err) {
          res.status(500).send({ error: 'db fail3' });
          return;
        }
        assign['user']['rates'] = row;

        strSQL = "SELECT * FROM job WHERE id = " + jobId;
        db.all(strSQL, (err, row) => {
          if (err) {
            res.status(500).send({ error: 'db fail4' });
            return;
          }
          assign['job'] = row[0];

          strSQL = "SELECT * FROM category";
          db.all(strSQL, (err, row) => {
            if (err) {
              res.status(500).send({ error: 'db fail5' });
              return;
            }
            var categories = {};
            for (var r of row) {
              categories[r.id] = r;
            }
            assign['category'] = categories;
            console.log(assign);
            res.render('applicant', assign);
          });
        });
      });
    });
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  showApplicant(req, res, next);
});

module.exports = router;
