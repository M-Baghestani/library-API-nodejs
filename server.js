const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");
const wrr = require("./funcs/writeFunc.js");
const { readDB, writeDB } = require("./funcs/dbhelper.js");

const server = http.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/users") {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const convertedData = JSON.parse(data);
			wrr(
				res,
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(convertedData.users)
			);
		});
	} else if (req.method === "POST" && req.url === "/api/books/reserve") {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", () => {
				const { user_id, book_id, reserve_date, duration_days } =
					JSON.parse(body);
				if (!user_id || !book_id || !reserve_date || !duration_days) {
					wrr(
						res,
						400,
						{ "Content-Type": "application/json" },
						JSON.stringify({ message: "Pls Enter Your Info Completely" })
					);
				} else {
					const db = JSON.parse(data);
					const isFreeBook = db.books.some(
						(book) => book.id == book_id && book.free == 1
					);

					if (isFreeBook) {
						const theBook = db.books.filter((book) => book.id == book_id);
						theBook[0].free = 0;
						db.reserves.push({
							user_id,
							book_id,
							reserve_date,
							duration_days,
						});
						wrr(
							res,
							201,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "The Book Successfully Reserved!" })
						);
						// fs.writeFile("db.json", JSON.stringify(db), () => 0);
						writeDB(db);
					} else {
						wrr(
							res,
							409,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "The Book Already Reserved!" })
						);
					}
				}
			});
		});
	} else if (req.method === "GET" && req.url.startsWith("/api/users")) {
		const userID = url.parse(req.url, true).query.id;
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const result = db.users.filter((user) => {
				return user.id === parseInt(userID);
			});
			console.log(result);
			if (result.length > 0) {
				wrr(
					res,
					200,
					{ "Content-Type": "application/json" },
					JSON.stringify(result)
				);
			} else {
				wrr(
					res,
					400,
					{ "Content-Type": "application/json" },
					JSON.stringify({ message: "You Must Enter a Valid Value" })
				);
			}
		});
	} else if (req.method === "GET" && req.url === "/api/books") {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			wrr(
				res,
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(db.books)
			);
		});
	} else if (req.method === "GET" && req.url.startsWith("/api/books")) {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const bookID = url.parse(req.url, true).query.id;
			const bookInfo = db.books.filter((book) => {
				return book.id == bookID;
			});
			if (bookInfo.length > 0) {
				wrr(
					res,
					200,
					{ "Content-Type": "application/json" },
					JSON.stringify(bookInfo)
				);
			}
		});
	} else if (req.method === "POST" && req.url === "/api/users") {
		let body = "";
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			req.on("data", (chunk) => {
				body += chunk;
			});
			const db = JSON.parse(data);

			req.on("end", () => {
				body = JSON.parse(body);
				const isUserExist = db.users.some(
					(user) => user.username == body.username
				);
				if (isUserExist) {
					wrr(
						res,
						409,
						{ "Content-Type": "application/json" },
						JSON.stringify({ message: "The User Already Exist!" })
					);
				} else {
					let { name, username } = body;
					if (name && username) {
						const newUser = {
							id: crypto.randomUUID(),
							name,
							username,
							crime: 0,
							role: "GUEST",
						};
						db.users.push(newUser);
						wrr(
							res,
							201,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "The User Successfully Added!" })
						);
						// fs.writeFileSync("db.json", JSON.stringify(db));
						writeDB(db);
					} else {
						wrr(
							res,
							400,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "You Must Enter Both Data!" })
						);
					}
				}
			});
		});
	} else if (req.method === "POST" && req.url === "/api/books") {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", () => {
				const { title, author, price } = JSON.parse(body);
				const newBook = {
					id: crypto.randomUUID(),
					title,
					author,
					price,
					free: 1,
				};
				if (title && author && price) {
					isBookExist = JSON.parse(data).books.some(
						(book) => book.title === title && book.author == author
					);
					if (isBookExist) {
						wrr(
							res,
							400,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "The Book Already Exist!" })
						);
					} else {
						wrr(
							res,
							201,
							{ "Content-Type": "application/json" },
							JSON.stringify({ message: "Your Book Successfully Added!" })
						);
						const db = JSON.parse(data);
						db.books.push(newBook);
						writeDB(db);
					}
				}
			});
		});
	} else if (req.method === "PUT" && req.url === "/api/books") {
		const bookID = url.parse(req.url, true).query.id;
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const isBookExist = db.books.some((book) => book.id == bookID);

			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", () => {
				body = JSON.parse(body);

				if (!isBookExist) {
					wrr(
						res,
						400,
						{ "Content-Type": "application/json" },
						JSON.stringify({ message: "The Book Is Not Exist!" })
					);
				} else {
					const theBook = db.books.filter((book) => book.id == bookID);
					const title = body.title || theBook[0].title;
					const author = body.author || theBook[0].author;
					const price = body.price || theBook[0].price;
					const newDBWithoutTheBook = db.books.filter(
						(book) => book.id != bookID
					);
					const newBookVersion = {
						id: bookID,
						title,
						author,
						price,
						free: theBook[0].free,
					};
					newDBWithoutTheBook.push(newBookVersion);
					const newDB = {
						users: db.users,
						books: newDBWithoutTheBook,
						reserves: db.reserves,
						managers: db.managers,
					};
					writeDB(newDB);
					wrr(
						res,
						201,
						{ "Content-Type": "application/json" },
						JSON.stringify({ message: "The Book Is Updated!" })
					);
				}
			});
		});
	} else if (req.method === "PUT" && req.url === "/api/users") {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const userID = url.parse(req.url, true).query.id;
			const theUser = db.users.filter((user) => user.id == userID);
			const isUserExist = db.users.some((user) => user.id == userID);
			const userRole = theUser[0].role;
			if (isUserExist) {
				if (userRole === "GUEST") {
					let body = "";
					req.on("data", (chunk) => (body += chunk));
					req.on("end", () => {
						body = JSON.parse(body);
						const { name, username } = body;
						if (body.crime) {
							wrr(
								res,
								400,
								{ "Content-Type": "application/json" },
								JSON.stringify({
									message: "You Cannot Change Your Crime! Pls Try Again!",
								})
							);
						} else if (body.role) {
							wrr(
								res,
								400,
								{ "Content-Type": "application/json" },
								JSON.stringify({
									message: "You Cannot Change Your Role! Pls Try Again!",
								})
							);
						} else {
							const theUser = db.users.filter((user) => user.id == userID);
							const theNewUser = {
								id: theUser[0].id,
								name,
								username,
								crime: theUser[0].crime,
								role: theUser[0].role,
							};
							const newUsersList = db.users.filter((user) => user.id != userID);
							newUsersList.push(theNewUser);
							const newDB = {
								users: newUsersList,
								books: db.books,
								reserves: db.reserves,
								managers: db.managers,
							};
							writeDB(newDB);
							wrr(
								res,
								201,
								{ "Content-Type": "application/json" },
								JSON.stringify({
									message: "The User Has Been Updated!",
								})
							);
						}
					});
				} else if (userRole === "ADMIN") {
					let body = "";
					req.on("data", (chunk) => (body += chunk));
					req.on("end", () => {
						body = JSON.parse(body);

						const id = body.id;
						const theUser = db.users.filter((user) => user.id == id);
						const crime = body.crime || theUser[0].crime;
						const role = body.role || theUser[0].role;
						if (theUser[0].role === "ADMIN") {
							wrr(
								res,
								400,
								{ "Content-Type": "application/json" },
								JSON.stringify({
									message: "You Cannot Change The Admin's Info!",
								})
							);
						} else {
							const userUpdated = {
								id,
								name: theUser[0].name,
								username: theUser[0].username,
								crime,
								role,
							};
							const newUserList = db.users.filter((user) => user.id != id);
							newUserList.push(userUpdated);
							const newDB = {
								users: newUserList,
								books: db.books,
								reserves: db.reserves,
								managers: db.managers,
							};
							writeDB(newDB);
							wrr(
								res,
								201,
								{ "Content-Type": "application/json" },
								JSON.stringify({
									message: "The User Has Been Updated!",
								})
							);
						}
					});
				} else {
					wrr(
						res,
						400,
						{ "Content-Type": "application/json" },
						JSON.stringify({
							message: "The User Don't Has a Role!",
						})
					);
				}
			} else {
				wrr(
					res,
					404,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "The User Not Found!",
					})
				);
			}
		});
	} else if (req.method === "DELETE" && req.url.startsWith("/api/users")) {
		const userID = url.parse(req.url, true).query.id;
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const isUserExist = db.users.some((user) => user.id == userID);
			if (!isUserExist) {
				wrr(
					res,
					404,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "The User Not Found!",
					})
				);
			} else {
				const newUsers = db.users.filter((user) => user.id != userID);
				const newDB = {
					users: newUsers,
					books: db.books,
					reserves: db.reserves,
					managers: db.managers,
				};
				writeDB(newDB);
				wrr(
					res,
					201,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "The User Has Been Successfully Deleted!",
					})
				);
			}
		});
	} else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const db = JSON.parse(data);
			const bookID = url.parse(req.url, true).query.id;
			const newBooksList = db.books.filter((book) => book.id != bookID);
			const isBookExist = db.books.some((book) => book.id == bookID);
			if (!isBookExist) {
				wrr(
					res,
					404,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "The Book Not Found!",
					})
				);
			} else {
				wrr(
					res,
					201,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "The Book Has Been Successfully Deleted!",
					})
				);
				const newDB = {
					users: db.users,
					books: newBooksList,
					reserves: db.reserves,
					managers: db.managers,
				};
				writeDB(newDB);
			}
		});
	} else if (req.method === "POST" && req.url.startsWith("/api/makeAdmin")) {
		fs.readFile("db.json", (err, data) => {
			if (err) {
				throw err;
			}
			const managerID = url.parse(req.url, true).query.id;
			const db = JSON.parse(data);
			const isManagerExist = db.managers.some(
				(manager) => managerID == manager.id
			);
			if (isManagerExist) {
				let body = "";
				req.on("data", (chunk) => (body += chunk));
				req.on("end", () => {
					const { id, role } = JSON.parse(body);
					const userINFO = db.users.filter((user) => user.id == id);
					if (userINFO[0].role != "ADMIN") {
						const userUpdate = {
							id,
							name: userINFO[0].name,
							username: userINFO[0].username,
							crime: 0,
							role,
						};
						const newUserList = db.users.filter((user) => user.id != id);
						newUserList.push(userUpdate);
						const newDB = {
							users: newUserList,
							books: db.books,
							reserves: db.reserves,
							managers: db.managers,
						};
						writeDB(newDB);
						wrr(
							res,
							201,
							{ "Content-Type": "application/json" },
							JSON.stringify({
								message: "The User Has Been Updated To Admin!",
							})
						);
					} else {
						wrr(
							res,
							409,
							{ "Content-Type": "application/json" },
							JSON.stringify({
								message: "The User Is Already Admin!",
							})
						);
					}
				});
			} else {
				wrr(
					res,
					403,
					{ "Content-Type": "application/json" },
					JSON.stringify({
						message: "You Don't Have Permission To Enter This Section!",
					})
				);
			}
		});
	}
});

server.listen(5500, "127.0.0.1", () =>
	console.log("Server Running On Port 5500")
);
