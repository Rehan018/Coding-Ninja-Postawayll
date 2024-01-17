import mongoose from "mongoose";
import { Like } from "./like.schema.js";

class LikeController {
  static async getLikesById(req, res) {
    const id = req.params.id;

    try {
      const likes = await Like.find({
        $or: [{ postId: id, isPostLike: true }, { commentId: id, isPostLike: false }]
      });

      res.json(likes);
    } catch (error) {
      console.error("Error retrieving likes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async toggleLike(req, res) {
    const id = req.params.id;
    const userId = req.user._id;

    try {
      const existingLike = await Like.findOne({
        user: userId,
        $or: [{ postId: id, isPostLike: true }, { commentId: id, isPostLike: false }]
      });

      if (existingLike) {
        // If the like exists, remove it (toggle off)
        await existingLike.remove();
        res.json({ message: "Like removed successfully" });
      } else {
        // If the like doesn't exist, add it (toggle on)
        const isPostLike = req.body.isPostLike || true; // You may adjust this based on your requirements
        const like = new Like({ user: userId, postId: id, isPostLike });
        await like.save();
        res.status(201).json({ message: "Like added successfully", like });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default LikeController;