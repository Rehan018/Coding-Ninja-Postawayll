import mongoose from "mongoose";
import fraindSchema from "./friend.schema.js";

const User=mongoose.model('Friend',fraindSchema);
class FriendshipController {
  static async getFriends(req, res) {
    try {
      const user = await User.findById(req.params.userId).populate("friends", "username email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.friends);
    } catch (error) {
      console.error("Error getting friends:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getPendingRequests(req, res) {
    try {
      const user = await User.findById(req.user._id).populate("pendingRequests", "username email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.pendingRequests);
    } catch (error) {
      console.error("Error getting pending requests:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async toggleFriendship(req, res) {
    try {
      const friendId = req.params.friendId;
      const user = await User.findById(req.user._id);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      const isFriend = user.friends.includes(friendId);

      if (isFriend) {
        user.friends.pull(friendId);
        friend.friends.pull(req.user._id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(req.user._id);
      }

      await user.save();
      await friend.save();

      res.json({ message: "Friendship toggled successfully" });
    } catch (error) {
      console.error("Error toggling friendship:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async respondToRequest(req, res) {
    try {
      const friendId = req.params.friendId;
      const user = await User.findById(req.user._id);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      const isPending = user.pendingRequests.includes(friendId);

      if (!isPending) {
        return res.status(400).json({ message: "No pending request from this user" });
      }

      const acceptRequest = req.body.accept;
      if (acceptRequest) {
        user.friends.push(friendId);
        friend.friends.push(req.user._id);
      }

      user.pendingRequests.pull(friendId);
      await user.save();
      await friend.save();

      res.json({ message: "Friend request responded successfully" });
    } catch (error) {
      console.error("Error responding to friend request:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default FriendshipController;
