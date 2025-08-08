const fs = require("fs");
const db = require("../db.json");
const path = require("path");
const dbPath = path.join(__dirname, "../db.json");

const getAll = async () => {
  return await db.users;
};

const getOne = (id) => {
  return new Promise((resolve, reject) => {
    const userInfo = db.users.filter((user) => user.id == id);
    resolve(userInfo);
  });
};

const write = async (data) => {
  await db.users.push(data);
  fs.writeFile(dbPath, JSON.stringify(db), (err) => {
    if (err) {
      throw err;
    }
  });
  return await { message: "The User Successfully Added!" };
};

const update = async (data, id) => {
  const newDBWithoutTheUser = db.users.filter((user) => user.id != id);
  newDBWithoutTheUser.push(data);
  const newDB = {
    ...db,
    users: newDBWithoutTheUser,
  };
  fs.writeFile(dbPath, JSON.stringify(newDB), (err) => {
    if (err) {
      throw err;
    }
  });
  return { message: "The User Successfully updated!" };
};

const removeOne = async (id) => {
  const newUserDb = db.users.filter((user) => user.id != id);
  const newDB = { ...db, users: newUserDb };
  await fs.writeFile(dbPath, JSON.stringify(newDB), (err) => {
    if (err) {
      throw err;
    }
  });
  return await { message: "The user successfully deleted!" };
};

module.exports = {
  getAll,
  getOne,
  write,
  update,
  removeOne,
};
