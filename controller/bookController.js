const BookModel = require("../models/Book.js");
const wrr = require("./../funcs/writeFunc.js");

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

const getOne = async (req, res, id) => {
  try {
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

module.exports = {
  getAll,
  getOne,
  createBook,
};
