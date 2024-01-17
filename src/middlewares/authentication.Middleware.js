import Jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { userSchema } from "../features/user/user.schema.js";

dotenv.config();
const SECRET_KEY = "your_actual_secret_key";
const authMiddleware = async (req, res, next) => {
    try {
      const authorizationHeader = req.header("Authorization");
      if (!authorizationHeader) {
        console.error("No Authorization header provided");
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }
  
      const token = authorizationHeader.replace("Bearer", "").trim();
      if (!token) {
        console.error("Token is empty");
        return res.status(401).json({ message: "Unauthorized - Token is empty" });
      }
  
      const decoded = Jwt.verify(token, SECRET_KEY);
      const user = await userSchema.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
  
      if (!user) {
        console.error("User not found");
        throw new Error();
      }
  
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in authentication middleware:", error);
      res?.status(401)?.json({ message: "Unauthorized - Invalid token" });
    }
  };
  
  export default authMiddleware;