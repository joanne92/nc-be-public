const mongoose = require("mongoose");
mongoose.Promise = Promise;

const { DB_URL } = require("../config")[process.env.NODE_ENV];

const seedDB = require("./seed");

mongoose
  .connect(DB_URL)
  .then(() => seedDB(DB_URL).then(() => mongoose.disconnect()));
