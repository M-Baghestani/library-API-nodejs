function wrr(res, statusCode, content, text) {
	res.writeHead(statusCode, content);
	res.write(text);
	res.end();
}

module.exports = wrr;
