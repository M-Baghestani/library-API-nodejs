const addAdmin = async (theUser) => {
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
  
};

module.exports = {
  addAdmin,
};
