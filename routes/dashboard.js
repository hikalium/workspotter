var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
    var status = req.query.status;
    var content = "";
    var type = "";
    var assign = {};
    var userId = req.user.id;
//    console.log(req);

    switch (status) {
        case 'apply_complete':
            content = "応募者が採用情報が更新されました。";
            type = "info";
            break;
        case 'rate_complete':
            content = "評価を受け付けました。";
            type = "info";
            break;
    }
    assign['msg'] = {};
    assign['msg']['content'] = content;
    assign['msg']['type'] = type;
    assign['userId'] = userId;

    var strSQL = "SELECT * FROM job WHERE userId = " + userId + " AND isRecruitingFlg = '1'";
    db.all(strSQL, (err, row) => {
        if(err){
            res.status(500).send({ error: 'db fail' });
            return;
        }
        console.log(row);
        assign['recruitingJobs'] = row;

        console.log(assign);

        res.render('dashboard', assign);
    });

    //res.render('dashboard', {});
});

module.exports = router;
