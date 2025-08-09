const fs = require("fs");
const db = require("../db.json");
const path = require("path");
const dbPath = path.join(__dirname, "../db.json");

const getAll = async () => {
  return await db.managers;
};

const addManager = async (theUser) => {
  const userID = theUser.id;
  const name = theUser.name;
  const username = theUser.username;

  const theNewManager = {
    id: userID,
    name,
    username,
    role: "MANAGER",
  };
  const newUserDB = db.users.filter((user) => user.id != userID);
  db.managers.push(theNewManager);
  const newDB = {
    ...db,
    users: newUserDB,
  };
  fs.writeFile(dbPath, JSON.stringify(newDB), (err) => {
    if (err) {
      throw err;
    }
  });
  return await { message: "The Manager Has Been Added" };
};

module.exports = {
  addManager,
  getAll,
};
