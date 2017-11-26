var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.user){
		res.redirect("/login");
		return;
	}
    var status = req.query.status;
    var content = "";
    var type = "";
    var assign = {};
    var userId = req.user.id;
    console.log(userId);

    switch (status) {
        case 'apply_complete':
            content = "採用情報が更新されました。";
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

    var strSQL = "SELECT * FROM job WHERE userId = ? AND isRecruitingFlg = 1";
    db.all(strSQL, [userId], (err, row) => {
        if(err){
            res.status(500).send({ error: 'db fail' });
            return;
        }
        var obj = {};
        var ids = [];
        for (r of row) {
            obj[r.id] = r;
            ids.push(r.id);
        }
        assign['recruitingJobs'] = obj;

        strSQL = "SELECT * FROM apply WHERE status = 0 AND jobId IN (" + ids.join([separator = ',']) + ")";
        db.all(strSQL, (err, row) => {
            if(err){
                res.status(500).send({ error: 'db fail' });
                return;
            }
            assign['applies'] = row;
            var uids = [];
            for (r of row) {
                uids.push(r.userId);
            }

            strSQL = "SELECT * FROM user WHERE id IN (" + uids.join([separator = ',']) + ")";
            db.all(strSQL, (err, row) => {
                if(err){
                    res.status(500).send({ error: 'db fail' });
                    return;
                }
                obj = {};
                for (r of row) {
                    obj[r.id] = r;
                }
                assign['user'] = obj;
                res.render('dashboard', assign);
            });
        });
    });

    //res.render('dashboard', {});
});

module.exports = router;
