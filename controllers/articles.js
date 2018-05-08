const mongoose = require("mongoose");

const { Users, Articles, Comments, Topics } = require("../models");

function getAllArticles(req, res, next) {
  Comments.find({})
    .then(comments => {
      let articleTally = comments.reduce((acc, curr, i) => {
        acc[curr.belongs_to]
          ? acc[curr.belongs_to]++
          : (acc[curr.belongs_to] = 1);
        return acc;
      }, {});

      return Promise.all([articleTally, Articles.find({})]);
    })

    .then(([articleTally, articles]) => {
      articles = articles.map(article => {
        const { _id, title, body, belongs_to, votes, created_by } = article;
        const comments = articleTally[article._id]
          ? articleTally[article._id]
          : 0;
        return { _id, title, body, belongs_to, votes, created_by, comments };
      });
      return res.send({ articles });
    })
    .catch(next);
}

function getArticleByArticleId(req, res, next) {
  const { article_id } = req.params;
  Articles.find({ _id: article_id })
    .then(article => {
      return res.send({ article });
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Comments.find({ belongs_to: article_id })
    .then(comments => {
      return res.send({ comments });
    })
    .catch(next);
}

function addComment(req, res, next) {
  const { article_id } = req.params;
  const userIds = [];
  const comment = {};
  comment.body = req.body.comment;

  return Users.find({})
    .then(users => {
      users.forEach(user => {
        userIds.push(user._id);
      });
    })
    .then(() => {
      comment.created_by = userIds[Math.floor(Math.random() * userIds.length)];
      comment.belongs_to = article_id;
      console.log(Comments);
      return new Comments(comment).save();
    })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(error => {
      console.log(error);
      next(error, req, res, next);
    });
}

function changeVoteCountByOne(req, res, next) {
  const { article_id } = req.params;
  const { vote } = req.query;

  let newVote;
  if (vote === "up") {
    newVote = 1;
  } else if (vote === "down") {
    newVote = -1;
  } else {
    return;
  }

  return Articles.findOneAndUpdate(
    { _id: article_id },
    { $inc: { votes: newVote } },
    { new: true }
  )
    .then(updatedArticle => {
      res.status(201).send({ updatedArticle });
    })
    .catch(next);
}

module.exports = {
  getAllArticles,
  getArticleByArticleId,
  getCommentsByArticleId,
  addComment,
  changeVoteCountByOne
};
