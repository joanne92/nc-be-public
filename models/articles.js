const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "topics",
    required: true
  },
  votes: {
    type: Number,
    required: true,
    default: 0
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

module.exports = mongoose.model("articles", ArticleSchema);
