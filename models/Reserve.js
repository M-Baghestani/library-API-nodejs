const fs = require("fs");
const db = require("../db.json");
const path = require("path");
const wrr = require("../funcs/writeFunc");
const { markAsUncloneable } = require("worker_threads");
const dbPath = path.join(__dirname, "../db.json");

const createReserve = async (data, theBook) => {
  await db.reserves.push(data);
  const newBookDB = db.books.filter((book) => book.id != theBook.id);
  theBook.free = 0;
  newBookDB.push(theBook);
  const newDB = {
    users: db.users,
    books: db.books,
    reserves: db.reserves,
    managers: db.managers,
  };
  fs.writeFile(dbPath, JSON.stringify(newDB), (err) => {
    if (err) {
      throw err;
    }
  });
  return await { message: "The Book Has Been Successfully Reserved!" };
};

module.exports = {
  createReserve,
};
