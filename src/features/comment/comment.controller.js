import mongoose from "mongoose";
import { Comment } from "./comment.schema.js";

class CommentController {
  static async getCommentsForPost(req, res) {
    try {
      const postId = req.params.postId;
      const comments = await Comment.find({ post: postId }).populate("user", "username email");
      res.json(comments);
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async addCommentToPost(req, res) {
    const { content } = req.body;
    const postId = req.params.postId;
    try {
      const newComment = new Comment({ content, user: req.user._id, post: postId });
      await newComment.save();
      res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteComment(req, res) {
    const commentId = req.params.commentId;
    try {
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
        return res.status(404).json({ message: "No comment with this id was found" });
      }
      res.json({ message: "Comment deleted successfully", comment: deletedComment });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateComment(req, res) {
    const commentId = req.params.commentId;
    const { content } = req.body;
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true } // return the updated comment
      );
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default CommentController;
