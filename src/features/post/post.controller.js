import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";

const Post = mongoose.model("Post", postSchema);

class PostController {
  static async createPost(req, res) {
    const { title, content } = req.body;
    try {
      const newPost = new Post({ title, content, user: req.user._id ,image:req.file? req.file.buffer:undefined,});
      await newPost.save();
      res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getAllPosts(req, res) {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      console.error("Error retrieving posts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getPostById(req, res) {
    const postId = req.params.postid;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "No post found with given id." });
      }
      res.json(post);
    } catch (error) {
      console.error("Error retrieving post by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getUserPosts(req, res) {
    const userId = req.params.userid;
    try {
      const userPosts = await Post.find({ user: userId }).sort({
        createdAt: -1,
      });
      res.json(userPosts);
    } catch (error) {
      console.error("Error retrieving user posts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async deletePost(req, res) {
    const postId = req.params.postid;
    try {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res
          .status(404)
          .json({ message: "No post with this id was found" });
      }
      res.json({ message: "Post deleted successfully", post: deletedPost });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async updatePost(req, res) {
    const postId = req.params.postid;
    const { title, content } = req.body;
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, content },
        { new: true } //return the updated post
      );
      if(!updatedPost){
        return res.status(404).json({message:'Post not found'});
      }
      res.json({message:"Post update successfully",Post:updatedPost});
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default PostController;
