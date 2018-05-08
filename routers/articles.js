const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getCommentsByArticleId,
  addComment,
  changeVoteCountByOne,
  getArticleByArticleId
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", addComment);
articlesRouter.put("/:article_id", changeVoteCountByOne);
articlesRouter.get("/:article_id", getArticleByArticleId);

module.exports = articlesRouter;
