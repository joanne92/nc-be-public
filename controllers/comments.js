const mongoose = require("mongoose");

const { Users, Articles, Comments, Topics } = require("../models");

function changeCommentVoteCountByOne(req, res, next) {
  const { comment_id } = req.params;
  const { vote } = req.query;
  let newVote;
  if (vote === "up") {
    newVote = 1;
  } else if (vote === "down") {
    newVote = -1;
  } else {
    return;
  }

  return Comments.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: newVote } },
    { new: true }
  )

    .then(updatedComment => {
      res.status(201).send({ updatedComment });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  return Comments.findByIdAndRemove(comment_id)
    .then(deletedComment => {
      res.status(200).send({ deletedComment });
    })
    .catch(next);
}

function getAllComments(req, res, next) {
  Comments.find({})
    .then(comments => {
      return res.send({ comments });
    })
    .catch(next);
}

module.exports = {
  changeCommentVoteCountByOne,
  deleteComment,
  getAllComments
};
