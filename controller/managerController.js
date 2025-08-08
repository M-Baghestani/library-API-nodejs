const url = require("url");
const ManagerModel = require("../models/Manager");
const UserModel = require("../models/User");
const wrr = require("../funcs/writeFunc");

const addAdmin = async (req, res) => {
  const managerDB = ManagerModel.getAll();
  const userDB = UserModel.getAll();
  const managerID = url.parse(req.url, true).query.id;
  const isManagerExist = managerDB.some((manager) => manager.id == managerID);

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    body = JSON.parse(body);
    const userID = body.user_id;
    const isUserExist = userDB.some((user) => user.id == userID);
    const theUser = userDB.find((user) => user.id == userID);
    if (isUserExist && isManagerExist && theUser.role != "ADMIN") {
      const msg = ManagerModel.makeAdmin(theUser);
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
        { message: "The User Or The Manager Not Found!" }
      );
    }
  });
};

module.exports = {
  addAdmin,
};
