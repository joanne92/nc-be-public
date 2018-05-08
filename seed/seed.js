const mongoose = require("mongoose");
mongoose.Promise = Promise;

const { COMMENTS } = require("../config")[process.env.NODE_ENV];
const DB_URL = require("../config")[process.env.NODE_ENV].DB_URL;

const { Users, Articles, Topics, Comments } = require("../models");

const { articlesData, topicsData, usersData } = require(`./${
  process.env.NODE_ENV
}-data`);

const Chance = require("chance");
let chance = new Chance();

function seedDB(DB_URL) {
  const userIdsArray = [];
  const commentArray = [];
  let topicsId;
  console.log(`connected to ${DB_URL}`);
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      console.log("dropped db");
      return Promise.all([
        Topics.insertMany(topicsData),
        Users.insertMany(usersData)
      ]);
    })
    .then(([topicDocs, usersDocs]) => {
      topicsId = generateIds(topicDocs);
      pushUsersIdIntoArray(usersDocs);
      const newArticleData = getArticles(articlesData);
      return Promise.all([
        topicDocs,
        usersDocs,
        Articles.insertMany(newArticleData)
      ]);
    })
    .then(([topicDocs, usersDocs, articleDocs]) => {
      createComments(articleDocs);

      return Promise.all([
        topicDocs,
        usersDocs,
        articleDocs,
        Comments.insertMany(commentArray)
      ]);
    })
    .then(([topicDocs, usersDocs, articleDocs, commentsDocs]) => {
      console.log("inserted");

      return Promise.all([topicDocs, usersDocs, articleDocs, commentsDocs]);
    });
  function generateIds(docs) {
    return docs.reduce((acc, item, i) => {
      acc[item.title] = docs[i]._id;
      return acc;
    }, {});
  }

  function pushUsersIdIntoArray(docs) {
    docs.forEach(user => {
      userIdsArray.push(user._id);
    });
  }

  function getArticles(data) {
    return data.map(article => {
      let { title, body, topic } = article;
      topic = topic[0].toUpperCase() + topic.slice(1);
      const belongs_to = topicsId[topic];
      const created_by =
        userIdsArray[Math.floor(Math.random() * userIdsArray.length)];
      return { title, body, belongs_to, created_by };
    });
  }

  function createComments(docs) {
    for (let i = 0; i < COMMENTS; i++) {
      const commentObj = {};
      commentObj.body = chance.paragraph();
      commentObj.belongs_to = docs[Math.floor(Math.random() * docs.length)]._id;
      commentObj.created_by =
        userIdsArray[Math.floor(Math.random() * userIdsArray.length)];
      commentArray.push(commentObj);
    }
  }
}

module.exports = seedDB;
