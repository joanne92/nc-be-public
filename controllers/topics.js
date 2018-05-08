const mongoose = require("mongoose");

const { Users, Articles, Comments, Topics } = require("../models");

function getAllTopics(req, res, next) {
  Topics.find({})
    .then(topics => {
      return res.send({ topics });
    })
    .catch(next);
}

function getArticlesByTopicId(req, res, next) {
  let id = req.params.topic_id;
  return Topics.findOne({ _id: id })
    .then(topic => {
      return Articles.find({ belongs_to: topic._id })
        .lean()
        .populate("belongs_to", "title -_id")
        .populate("created_by", "username -_id")
        .then(articles => {
          let arrOfArticles = [articles];
          let result = arrOfArticles[0].map(post => {
            post.created_by = post.created_by.username;
            post.belongs_to = post.belongs_to.title;

            return post;
          });
          res.status(200).send({ articles });
        });
    })
    .catch(next);
}

// function getArticlesByTopicId(req, res, next) {
//   const { topic_id } = req.params;
//   Articles.find({ belongs_to: topic_id })
//     .then(articles => {
//       return Promise.all([articles, Users.find({})]);
//     })
//     .then(([articles, users]) => {
//       const newArts = articles.map(article => {
//         users.forEach(user => {
//           if (article.created_by === user._id) {
//             return user.name;
//           }
//         });
//       });
//       return newArts;
//     })
//     .then(articles => {
//       return res.status(200).send({ articles });
//     })
//     .catch(next);
// }

// function getArticlesByTopicId(req, res, next) {
//   const { topic_id } = req.params;
//   Articles.find({ belongs_to: topic_id })
//     .then(articles => {
//       res.status(200).send({ articles });
//     })
//     .catch(next);
// }

module.exports = { getAllTopics, getArticlesByTopicId };
