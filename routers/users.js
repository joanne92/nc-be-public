const usersRouter = require("express").Router();

const {
  getAllUsersByUsername,
  getAllUsers,
  getAllUsersById
} = require("../controllers/users");

usersRouter.get("/:username", getAllUsersByUsername);

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;
