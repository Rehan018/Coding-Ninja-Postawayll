import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.db_url;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url, {
      // No need for useNewUrlParser and useUnifiedTopology
    });
    console.log("Connected to MongoDB using Mongoose");
  } catch (err) {
    console.log("Error while connecting to db");
    console.log(err);
  }
};
