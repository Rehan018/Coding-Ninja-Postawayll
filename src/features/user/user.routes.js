import express from 'express';
import UserController from './user.controller.js';
import authMiddleware from '../../middlewares/authentication.Middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
const userRouter=express.Router();
userRouter.post('/signup',UserController.signup);
userRouter.post('/signin',UserController.login);
userRouter.post('/logout',authMiddleware,UserController.logout);
userRouter.post('/logout-all-devices',authMiddleware,UserController.logoutAllDevices);
userRouter.post('/forgot-password',UserController.forgotPassword);
userRouter.post('/reset-password',jwtAuth,UserController.resetPassword);

userRouter.get('/get-details/:userId',authMiddleware,UserController.getUserDetails);
userRouter.get('/get-all-details',authMiddleware,UserController.getAllUserDetails);
userRouter.patch('/update-details/:userId',authMiddleware,jwtAuth, UserController.updateUserDetails);

export default userRouter;