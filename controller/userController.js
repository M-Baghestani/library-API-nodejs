const fs = require("fs");
const wrr = require("../funcs/writeFunc");
const userModel = require("./../models/User");

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
    const userInfo = userModel.getOne(id);
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
    const isExistUser = usersDB.some((user) => user.username == body.username);
    if (isExistUser) {
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

module.exports = {
  getAll,
  getOne,
  createUser,
};
