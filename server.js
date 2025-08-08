const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");
const wrr = require("./funcs/writeFunc.js");
const bookController = require("./controller/bookController.js");
const userController = require("./controller/userController.js");
const reserveController = require("./controller/reserveController.js");
const { readDB, writeDB } = require("./funcs/dbhelper.js");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/users") {
    userController.getAll(req, res);
  } else if (req.method === "POST" && req.url === "/api/books/reserve") {
    // fs.readFile("db.json", (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   let body = "";
    //   req.on("data", (chunk) => {
    //     body += chunk;
    //   });
    //   req.on("end", () => {
    //     const { user_id, book_id, reserve_date, duration_days } =
    //       JSON.parse(body);
    //     if (!user_id || !book_id || !reserve_date || !duration_days) {
    //       wrr(
    //         res,
    //         400,
    //         { "Content-Type": "application/json" },
    //         JSON.stringify({ message: "Pls Enter Your Info Completely" })
    //       );
    //     } else {
    //       const db = JSON.parse(data);
    //       const isFreeBook = db.books.some(
    //         (book) => book.id == book_id && book.free == 1
    //       );
    //       if (isFreeBook) {
    //         const theBook = db.books.filter((book) => book.id == book_id);
    //         theBook[0].free = 0;
    //         db.reserves.push({
    //           user_id,
    //           book_id,
    //           reserve_date,
    //           duration_days,
    //         });
    //         wrr(
    //           res,
    //           201,
    //           { "Content-Type": "application/json" },
    //           JSON.stringify({ message: "The Book Successfully Reserved!" })
    //         );
    //         // fs.writeFile("db.json", JSON.stringify(db), () => 0);
    //         writeDB(db);
    //       } else {
    //         wrr(
    //           res,
    //           409,
    //           { "Content-Type": "application/json" },
    //           JSON.stringify({ message: "The Book Already Reserved!" })
    //         );
    //       }
    //     }
    //   });
    // });
    reserveController.reserve(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/api/users")) {
    const userID = url.parse(req.url, true).query.id;
    userController.getOne(req, res, userID);
  } else if (req.method === "GET" && req.url === "/api/books") {
    bookController.getAll(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/api/books")) {
    const bookID = url.parse(req.url, true).query.id;
    bookController.getOne(req, res, bookID);
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
