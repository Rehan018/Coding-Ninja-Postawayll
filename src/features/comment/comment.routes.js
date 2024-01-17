import express from "express";
import CommentController from "./comment.controller.js";
import authMiddleware from "../../middlewares/authentication.Middleware.js";
const commentRoute = express.Router();

commentRoute.get("/:postId", authMiddleware, CommentController.getCommentsForPost);
commentRoute.post("/:postId", authMiddleware, CommentController.addCommentToPost);
commentRoute.delete("/:postId/:commentId", authMiddleware, CommentController.deleteComment);
commentRoute.put("/:postId/:commentId", authMiddleware, CommentController.updateComment);

export default commentRoute;