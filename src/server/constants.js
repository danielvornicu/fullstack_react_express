module.exports.JWT_OPTIONS = {
  MEMBER_AUDIENCE: ["LOGIN"],
  ADMIN_AUDIENCE: [
    "LOGIN",
    "SHOW_USERS",
    "ADD_USER",
    "UPDATE_USER",
    "DELETE_USER",
  ],
};

module.exports.SHOW_USERS  = "SHOW_USERS";
module.exports.ADD_USER    = "ADD_USER";
module.exports.UPDATE_USER = "UPDATE_USER";
module.exports.DELETE_USER = "DELETE_USER";
