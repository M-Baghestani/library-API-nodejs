const ReserveModel = require("../models/Reserve");
const BookModel = require("../models/Book");
const UserModel = require("../models/User");
const wrr = require("../funcs/writeFunc");
const url = require("url");

const reserve = async (req, res) => {
  const userDB = await UserModel.getAll();
  const bookDB = await BookModel.getAll();

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    body = JSON.parse(body);
    const isBookExist = bookDB.some((book) => book.id == body.book_id);
    const isUserExist = userDB.some((user) => user.id == body.user_id);
    const theBook = bookDB.find((book) => book.id == body.book_id);

    if (isBookExist && isUserExist && theBook.free == 1) {
      const reserveBook = {
        user_id: body.user_id,
        book_id: body.book_id,
        reserve_date: body.reserve_date,
        duration_days: body.duration_days,
      };
      const msg = await ReserveModel.createReserve(reserveBook, theBook);
      wrr(
        res,
        201,
        { "content-type": "application/json" },
        JSON.stringify(msg)
      );
    } else {
      wrr(
        res,
        404,
        { "content-type": "application/json" },
        JSON.stringify({ message: "The User Or The Book not Found" })
      );
    }
  });
};

module.exports = {
  reserve,
};
