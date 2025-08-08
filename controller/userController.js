const fs = require("fs");
const wrr = require("../funcs/writeFunc");
const userModel = require("./../models/User");
const url = require("url");

const getAll = async (req, res) => {
  try {
    const users = await userModel.getAll();
    wrr(
      res,
      200,
      { "Content-Type": "application/json" },
      JSON.stringify(users)
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

const getOne = async (req, res) => {
  try {
    const userID = url.parse(req.url, true).query.id;
    const userInfo = await userModel.getOne(userID);
    wrr(
      res,
      200,
      { "content-type": "application/json" },
      JSON.stringify(userInfo)
    );
  } catch (error) {
    wrr(
      res,
      500,
      { "content-type": "application/json" },
      JSON.stringify({ error: error.message })
    );
  }
};

const createUser = async (req, res) => {
  const usersDB = await userModel.getAll();

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    body = JSON.parse(body);
    const isUserExist = usersDB.some((user) => user.username == body.username);
    if (isUserExist) {
      wrr(
        res,
        409,
        { "content-type": "application/json" },
        JSON.stringify({ message: "The Username already exist!" })
      );
    } else {
      const newUser = {
        id: crypto.randomUUID(),
        name: body.name,
        username: body.username,
        crime: 0,
        role: "GUEST",
      };
      const messageWrite = await userModel.write(newUser);
      wrr(
        res,
        201,
        { "content-type": "application/json" },
        JSON.stringify(messageWrite)
      );
    }
  });
};

const updateUser = async (req, res) => {
  const userDB = await userModel.getAll();
  const oldUserID = url.parse(req.url, true).query.id;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    body = JSON.parse(body);
    const isUserExist = userDB.some((user) => user.id == oldUserID);
    if (isUserExist) {
      const oldUser = userDB.find((user) => user.id == oldUserID);
      oldUser.name = body.name || oldUser.name;
      oldUser.username = body.username || oldUser.username;
      const messageUpdate = await userModel.update(oldUser, oldUserID);
      wrr(
        res,
        201,
        { "content-type": "application/json" },
        JSON.stringify(messageUpdate)
      );
    } else {
      wrr(
        res,
        400,
        { "content-type": "application/json" },
        JSON.stringify({ message: "The user is not exist!" })
      );
    }
  });
};

const removeOne = async (req, res) => {
  const userDB = await userModel.getAll();
  const userID = url.parse(req.url, true).query.id;

  const isUserExist = userDB.some((user) => user.id == userID);
  if (isUserExist) {
    const msg = await userModel.removeOne(userID);
    wrr(res, 201, { "content-type": "application/json" }, JSON.stringify(msg));
  } else {
    wrr(
      res,
      404,
      { "content-type": "application/json" },
      JSON.stringify({ message: "The User is not exist" })
    );
  }
};

module.exports = {
  getAll,
  getOne,
  createUser,
  updateUser,
  removeOne,
};
