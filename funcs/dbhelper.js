const fs = require("fs");

function readDB() {
	return JSON.parse(fs.readFileSync("db.json", "utf-8"));
}
function writeDB(data) {
	fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
