process.env.NODE_ENV = "test";
const app = require("../app");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const request = require("supertest")(app);
const { expect } = require("chai");
const seedDB = require("../seed/seed");
const { DB_URL } = require("../config")[process.env.NODE_ENV];

const { Users, Articles, Topics, Comments } = require("../models");

describe("/api", function() {
  this.timeout(10000);
  let topics, users, articles, comments;
  beforeEach(() => {
    return seedDB(DB_URL).then(data => {
      [topics, users, articles, comments] = data;
    });
  });
  after(() => {
    console.log("mongodb session disconnected");
    return mongoose.disconnect();
  });

  describe("/topics,", () => {
    it("GET returns a 200 status and all topics in an object", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(topics[1].slug).to.equal("cats");
        });
    });
    it("GET returns a 200 status and all articles that match the topic id in an object", () => {
      return request
        .get(`/api/topics/${topics[0]._id}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
  });
  describe("/articles,", () => {
    it("GET returns a 200 status and all articles in an object", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(4);
          expect(articles[2].title).to.equal(
            "They're not exactly dogs, are they?"
          );
          expect(articles[3].body).to.equal(
            "Bastet walks amongst us, and the cats are taking arms!"
          );
        });
    });
    it("GET returns a 200 status and all comments in an object", () => {
      return request
        .get(`/api/articles/${articles[2]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.comments).to.be.an("array");
        });
    });
    it("POST returns a 201 status and the new comment created", () => {
      const newObj = { comment: "this is a comment" };
      return request
        .post(`/api/articles/${articles[1]._id}/comments`)
        .send(newObj)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.comment).to.be.an("array");
          expect(res.body.comment[0].belongs_to).to.equal(`${articles[1]._id}`);
        });
    });
    it("PUT returns a 201 status and the article object with an updated vote count +1", () => {
      let newVoteCount = articles[3].votes + 1;
      return request
        .put(`/api/articles/${articles[3]._id}?vote=up`)
        .expect(201)
        .then(res => {
          console.log(res.body.updatedArticle);
          expect(res.body.updatedArticle).to.be.an("object");
          expect(res.body.updatedArticle.votes).to.equal(newVoteCount);
        });
    });
    it("PUT returns a 201 status and the article object with an updated vote count -1", () => {
      let newVoteCount = articles[0].votes - 1;
      return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(201)
        .then(res => {
          console.log(res.body.updatedArticle);
          expect(res.body.updatedArticle).to.be.an("object");
          expect(res.body.updatedArticle.votes).to.equal(newVoteCount);
        });
    });
  });
  describe("/articles,", () => {
    it("PUT returns a 201 status and the comment object with an updated vote count +1", () => {
      let newVoteCount = comments[2].votes + 1;
      return request
        .put(`/api/comments/${comments[2]._id}?vote=up`)
        .expect(201)
        .then(res => {
          console.log(res.body.updatedComment);
          expect(res.body.updatedComment).to.be.an("object");
          expect(res.body.updatedComment.votes).to.equal(newVoteCount);
        });
    });
    it("PUT returns a 201 status and the comment object with an updated vote count -1", () => {
      let newVoteCount = comments[1].votes - 1;
      return request
        .put(`/api/comments/${comments[1]._id}?vote=down`)
        .expect(201)
        .then(res => {
          console.log(res.body.updatedComment);
          expect(res.body.updatedComment).to.be.an("object");
          expect(res.body.updatedComment.votes).to.equal(newVoteCount);
        });
    });
    it("DELETE returns a 200 status and the comment object that has been deleted", () => {
      return request
        .delete(`/api/comments/${comments[2]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.deletedComment._id).to.equal(`${comments[2]._id}`);
        });
    });
  });
  describe("/users,", () => {
    it("GET returns a 200 status and the correct user object", () => {
      return request
        .get(`/api/users/${users[0].username}`)
        .expect(200)
        .then(res => {
          expect(res.body.user[0].username).to.equal(`${users[0].username}`);
          expect(res.body.user).to.be.an("array");
          expect(res.body).to.be.an("object");
        });
    });
  });
});
