import express from 'express';
import PostController from './post.controller.js';

import authMiddleware from '../../middlewares/authentication.Middleware.js';
import { upload } from '../../middlewares/fileupload.middleware.js';

const postRoute = express.Router();

postRoute.get('/all', PostController.getAllPosts);
postRoute.get('/:postid', PostController.getPostById);
postRoute.post('/user/:userid', authMiddleware, PostController.getUserPosts);
postRoute.post('/', authMiddleware, upload.single('Image'), PostController.createPost);
postRoute.delete('/:postid', authMiddleware, PostController.deletePost);
postRoute.put('/:postid', authMiddleware, PostController.updatePost);

export default postRoute;