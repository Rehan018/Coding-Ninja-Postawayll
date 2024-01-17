import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import userRouter from "./src/features/user/user.routes.js";
import postRoute from "./src/features/post/post.routes.js";
import friendshipRoute from "./src/features/fraindship/friend.routes.js";
import commentRoute from "./src/features/comment/comment.routes.js";
import likeRoute from "./src/features/like/like.routes.js";

const server = express();
const PORT = 3200;
server.use(bodyParser.json());
dotenv.config();

server.use(express.json());

// 3. Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

server.use("/api/users", userRouter);
server.use("/api/posts",postRoute);
server.use("/api/friends",friendshipRoute);
server.use("/api/comments",commentRoute);
server.use("/api/likes",likeRoute);


// 5. Specify port.
server.listen(PORT, () => {
  console.log("Server is running at 3200");
  // connectToMongoDB();
  connectUsingMongoose();
});
