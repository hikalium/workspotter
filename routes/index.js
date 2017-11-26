var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');

/* GET home page. */
router.get('/', function(req, res) {
	if(!req.user){
		res.redirect("/login");
		return;
	}

    var mg = "";
    if (req.query.status == 'apply_success') {
        mg = "応募が完了しました";
    }
	db.all("select * from freetime where userId = ?", [req.user.id], (err, ft) => {
		if(err){
			res.status(500).send({ error: 'db fail' });
			return;
		}
		db.all(`
			select job.name as work_name, job.id as job_id, * from job
				inner join reqrate on job.id = reqrate.jobId 
				inner join category on reqrate.categoryId = category.id 
					where exists(
						select * from freetime where userId = ? 
							and job.day == freetime.day and 
								freetime.timecode_from <= job.timecode_from 
								and job.timecode_to <= freetime.timecode_to)`, [req.user.id], (err, jb) => {
			if(err){
				res.status(500).send({ error: 'db fail' });
				return;
			}
			db.all("select category.name, rate.rate, rate.created_at from rate INNER JOIN category on rate.categoryId = category.id and rate.userId = ?", [req.user.id], (err, rates) =>{
				if(err){
					res.status(500).send({ error: 'db fail' });
					return;
				}
				res.render('index', { freetimes: ft, jobs: jb, rates: rates, msg: mg});
			})
		});
	});
});


module.exports = router;
