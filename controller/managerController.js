const url = require("url");
const ManagerModel = require("../models/Manager");
const UserModel = require("../models/User");
const wrr = require("../funcs/writeFunc");

const addManager = async (req, res) => {
  const managerDB = await ManagerModel.getAll();
  const userDB = await UserModel.getAll();
  const managerID = url.parse(req.url, true).query.id;
  const isManagerExist = managerDB.some((manager) => manager.id == managerID);

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    body = JSON.parse(body);
    const userID = body.user_id;
    const isUserExist = userDB.some((user) => user.id == userID);
    const theUser = userDB.find((user) => user.id == userID);
    if (isUserExist && isManagerExist && theUser.role != "ADMIN") {
      const msg = await ManagerModel.addManager(theUser);
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
        JSON.stringify({ message: "The User Or The Manager Not Found!" })
      );
    }
  });
};

module.exports = {
  addManager,
};
