var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

var userId;

/* GET home page. */
router.get('/', function(req, res, next) {
    userId = req.query.userId

    res.render('job_edit', { });
});

router.post('/', function (req, res, next) {
    var data = req.body;
    var start = data.startTime.toString().replace(":", "");
    var end = data.endTime.toString().replace(":", "");
    var isRec = (data.isRecruitingFlg)? 1: 0;

    console.log(data);

    //insert new data
    db.run('INSERT INTO JOB(userId, name, description, imageUrl, primaryRateId, payParamA, payParamB, payParamC, day, timecode_from, timecode_to, isRecruitingFlg) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        userId,
        data.companyName,
        data.description,
        data.imageUrl,
        data.primaryRateId,
        data.paramA,
        data.paramB,
        data.paramC,
        data.day,
        start,
        end,
        isRec
    ]);

    res.redirect('dashboard');

});

module.exports = router;
