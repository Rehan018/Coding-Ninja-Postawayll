import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  otpExpires: {
    type: Date,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});


