const http = require("http");
const bookController = require("./controller/bookController.js");
const userController = require("./controller/userController.js");
const reserveController = require("./controller/reserveController.js");
const managerController = require("./controller/managerController.js");
const server = http.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/users") {
		userController.getAll(req, res);
	} else if (req.method === "POST" && req.url === "/api/books/reserve") {
		reserveController.reserve(req, res);
	} else if (req.method === "GET" && req.url.startsWith("/api/users")) {
		userController.getOne(req, res, userID);
	} else if (req.method === "GET" && req.url === "/api/books") {
		bookController.getAll(req, res);
	} else if (req.method === "GET" && req.url.startsWith("/api/books")) {
		bookController.getOne(req, res);
	} else if (req.method === "POST" && req.url === "/api/users") {
		userController.createUser(req, res);
	} else if (req.method === "POST" && req.url === "/api/books") {
		bookController.createBook(req, res);
	} else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
		bookController.update(req, res);
	} else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
		userController.updateUser(req, res);
	} else if (req.method === "DELETE" && req.url.startsWith("/api/users")) {
		userController.removeOne(req, res);
	} else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
		bookController.removeOne(req, res);
	} else if (req.method === "POST" && req.url.startsWith("/api/makeManager")) {
		managerController.addManager(req, res);
	}
});

server.listen(5500, "127.0.0.1", () =>
	console.log("Server Running On Port 5500")
);
