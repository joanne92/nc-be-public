const commentsRouter = require("express").Router();

const {
  changeCommentVoteCountByOne,
  deleteComment,
  getAllComments
} = require("../controllers/comments");

commentsRouter.get("/", getAllComments);
commentsRouter.put("/:comment_id", changeCommentVoteCountByOne);
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
