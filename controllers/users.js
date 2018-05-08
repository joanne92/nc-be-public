const mongoose = require("mongoose");

const { Users, Articles, Comments, Topics } = require("../models");

function getAllUsersByUsername(req, res, next) {
  const username = req.params.username;
  return Users.find({ username: username })
    .then(user => {
      if (user.length === 0) {
        console.log(user);
        return next({
          status: 400,
          msg: `${username} is an invalid username`
        });
      } else {
        res.send({ user });
      }
    })
    .catch(next);
}

function getAllUsers(req, res, next) {
  return Users.find({}).then(users => {
    res.status(200).send({ users });
  });
}

module.exports = { getAllUsersByUsername, getAllUsers };
