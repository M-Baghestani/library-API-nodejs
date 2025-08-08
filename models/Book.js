const fs = require("fs");
const db = require("../db.json");
const path = require("path");
const dbPath = path.join(__dirname, "../db.json");

const getAll = () => {
  return new Promise((resolve, reject) => {
    resolve(db.books);
  });
};

const getOne = (id) => {
  return new Promise((resolve, reject) => {
    const bookInfo = db.books.filter((book) => book.id == id);
    resolve(bookInfo);
  });
};

const write = async (data) => {
  await db.books.push(data);
  fs,
    fs.writeFile(dbPath, JSON.stringify(db), (err) => {
      if (err) {
        throw err;
      }
    });
  return await { message: "The book successfully added!" };
};

const update = async (data, bookID) => {
  const newBookDB = await db.books.filter((book) => book.id != bookID);
  await newBookDB.push(data);
  fs.writeFile(dbPath, JSON.stringify({ ...db, books: newBookDB }), (err) => {
    if (err) {
      throw err;
    }
  });
  return await { message: "the book successfully edited!" };
};
module.exports = {
  getAll,
  getOne,
  write,
  update,
};
