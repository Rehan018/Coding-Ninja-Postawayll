import express from 'express';
import LikeController from './like.controller.js';
import authMiddleware from '../../middlewares/authentication.Middleware.js';

const likeRoute = express.Router();

likeRoute.get('/:id', LikeController.getLikesById);
likeRoute.post('/toggle/:id', authMiddleware, LikeController.toggleLike);

export default likeRoute;