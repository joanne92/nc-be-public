const topicsRouter = require("express").Router();

const { getAllTopics, getArticlesByTopicId } = require("../controllers/topics");

topicsRouter.get("/", getAllTopics);

topicsRouter.get("/:topic_id/articles", getArticlesByTopicId);

module.exports = topicsRouter;
