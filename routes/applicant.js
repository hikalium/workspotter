var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

const NOT_EVALUATED = 0;
const ACCEPTED = 1;
const REJECTED = 2;
const FINISHED = 3;

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
  strSQL += "SELECT * FROM apply WHERE id = ?";
  db.all(strSQL, [applyId], (err, row) => {
    if (err) {
      res.status(500).send({ error: 'db fail1' });
      return;
    }
    var userId = row[0].userId;
    var jobId = row[0].jobId;

    strSQL = "SELECT * FROM user WHERE id = ?";
    db.all(strSQL, [userId], (err, row) => {
      if (err) {
        res.status(500).send({ error: 'db fail2' });
        return;
      }
      assign['user'] = row[0];

      strSQL = "SELECT * FROM rate WHERE userId = ? ORDER BY created_at DESC";
      db.all(strSQL, [userId], (err, row) => {
        if (err) {
          res.status(500).send({ error: 'db fail3' });
          return;
        }
        assign['rates'] = [];
        var used = {};
        for (r of row) {
          if (used[r.categoryId]) {
            continue;
          } else {
            used[r.categoryId] = true;
          }
          assign['rates'].push(r);
        }

        strSQL = "SELECT * FROM job WHERE id = ?";
        db.all(strSQL, [jobId], (err, row) => {
          if (err) {
            res.status(500).send({ error: 'db fail4' });
            return;
          }
          var reqrateId = row[0].primaryRateId;
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

            strSQL = "SELECT * FROM reqrate WHERE id = ?";
            db.all(strSQL, [reqrateId], (err, row) => {
              if (err) {
                res.status(500).send({ error: 'db fail6' });
                return;
              }
              assign['jobMainCategoryId'] = row[0].categoryId;

              console.log(assign);
              res.render('applicant', assign);
            });
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
