const BookModel = require("../models/Book.js");
const wrr = require("./../funcs/writeFunc.js");
const url = require("url");
const getAll = async (req, res) => {
	try {
		const books = await BookModel.getAll();

		wrr(
			res,
			200,
			{ "Content-Type": "application/json" },
			JSON.stringify(books)
		);
	} catch (err) {
		wrr(
			res,
			500,
			{ "Content-Type": "application/json" },
			{ error: err.message }
		);
	}
};

const getOne = async (req, res) => {
	try {
		const id = url.parse(req.url, true).query.id;
		const bookInfo = await BookModel.getOne(id);
		wrr(
			res,
			201,
			{ "Content-Type": "application/json" },
			JSON.stringify(bookInfo)
		);
	} catch (error) {
		wrr(
			res,
			500,
			{ "Content-Type": "application/json" },
			{ error: error.message }
		);
	}
};

const createBook = async (req, res) => {
	const bookDB = await BookModel.getAll();
	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});
	req.on("end", async () => {
		body = JSON.parse(body);
		const isBookExist = await bookDB.some(
			(book) => book.title == body.title && book.author == body.author
		);
		if (isBookExist) {
			wrr(
				res,
				409,
				{ "content-type": "application/json" },
				JSON.stringify({ message: "The book is already exist!" })
			);
		} else {
			const newBook = {
				id: crypto.randomUUID(),
				title: body.title,
				author: body.author,
				price: body.price,
				free: 1,
			};
			const messageWrite = await BookModel.write(newBook);
			wrr(
				res,
				201,
				{ "content-type": "application/json" },
				JSON.stringify(messageWrite)
			);
		}
	});
};

const update = async (req, res) => {
	const bookDB = await BookModel.getAll();
	const bookID = url.parse(req.url, true).query.id;
	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});
	req.on("end", async () => {
		body = JSON.parse(body);
		const isBookExist = bookDB.some((book) => book.id == bookID);
		if (isBookExist) {
			const theBook = bookDB.find((book) => book.id == bookID);
			theBook.title = body.title || theBook.title;
			theBook.author = body.author || theBook.author;
			theBook.price = body.price || theBook.price;
			theBook.free = body.free || theBook.free;

			const messageUpdate = await BookModel.update(theBook, bookID);
			wrr(
				res,
				201,
				{ "content-type": "application/json" },
				JSON.stringify(messageUpdate)
			);
		} else {
			wrr(
				res,
				201,
				{ "content-type": "application/json" },
				JSON.stringify({ message: "The Book is not exist!" })
			);
		}
	});
};

const removeOne = async (req, res) => {
	const bookID = url.parse(req.url, true).query.id;
	const bookDb = await BookModel.getAll();

	const isBookExist = bookDb.filter((book) => book.id == bookID);

	if (isBookExist) {
		const msg = await BookModel.removeOne(bookID);
		wrr(res, 201, { "content-type": "application/json" }, JSON.stringify(msg));
	} else {
		wrr(
			res,
			404,
			{ "content-type": "application/json" },
			JSON.stringify({ message: "the book is not exist!" })
		);
	}
};

module.exports = {
	getAll,
	getOne,
	createBook,
	update,
	removeOne,
};
