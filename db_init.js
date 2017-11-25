const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('workspotter.sqlite3');
db.run("INSERT INTO user(id, name, password, isCompany) VALUES (?, ?, ?, ?)", [
		114514,
		"Takato Yamazaki",
		"takatakatenten",
		0]);
db.run("INSERT INTO user(id, name, password, isCompany) VALUES (?, ?, ?, ?)", [
		114514,
		"MenG",
		"menmenGG",
		0]);
db.run("INSERT INTO freetime(userId, day, from_hour, from_minute, to_hour, to_minute) VALUES (?, ?, ?, ?, ?, ?)", [
		114514,
		1,
		12,
		0,
		15,
		0]);
