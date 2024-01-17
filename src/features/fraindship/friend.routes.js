import express from 'express';
import authMiddleware from '../../middlewares/authentication.Middleware.js';
import FriendshipController from './fraind.controller.js';

const friendshipRoute=express.Router();
friendshipRoute.get("/get-friends/:userId", authMiddleware, FriendshipController.getFriends);
friendshipRoute.get("/get-pending-requests", authMiddleware, FriendshipController.getPendingRequests);
friendshipRoute.post("/toggle-friendship/:friendId", authMiddleware, FriendshipController.toggleFriendship);
friendshipRoute.post("/response-to-request/:friendId", authMiddleware, FriendshipController.respondToRequest);
export default friendshipRoute;