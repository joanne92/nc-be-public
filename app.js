if (!process.env.NODE_ENV) process.env.NODE_ENV = "dev";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const DB_URL =
  process.env.DB_URL || require("./config")[process.env.NODE_ENV].DB_URL;

const apiRouter = require("./routers/api");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.connect(DB_URL).then(() => {
  console.log(`app connected to DB ${DB_URL}`);
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to NC News! :)");
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => next({ status: 404 }));

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status === 404) {
    return res.status(404).send({
      msg: "page not found"
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === 14) {
    return res.status(400).send({
      msg: "bad request invalid query entered"
    });
  }
  if (err.name === "CastError") {
    return res.status(400).send({
      msg: "bad request invalid id entered"
    });
  }
  if (err.errors.body.name === "ValidatorError") {
    return res.status(400).send({
      msg: "bad request comment must be entered"
    });
  }
  if (err.status === 400) {
    return res.status(400).send(err.msg);
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error", err });
});

module.exports = app;
