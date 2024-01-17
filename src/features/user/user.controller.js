import { userSchema } from "./user.schema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const User = mongoose.model("User", userSchema);

const saltRounds = 10;
const SECRET_KEY = "your_actual_secret_key";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
class UserController {
  static async signup(req, res) {
    const { username, email, password } = req.body;
    console.log("email mila: ",email);
    try {
      const exitingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      console.log("email mila: ",exitingUser);
      if (exitingUser) {
        return res
          .status(400)
          .json({ message: "Email or username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
      await user.save();
      console.log("User signup successful");
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      res.status(500).json({ message: "Code me kuchh gadbad hai" });
    }
  }
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      console.log("Attempting login for email:", email);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      let token;
      try {
        token = jwt.sign({ _id: user._id.toString() }, SECRET_KEY, {
          expiresIn: "1h",
        });
        console.log("Generated token:", token);
      } catch (signError) {
        console.error("Error during jwt.sign:", signError);
        throw new Error("Token generation failed");
      }
      user.tokens = user.tokens.concat({ token });
      await user.save();
      console.log("User after saving:", user);

      res.json({ token, message: "Login successful" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "during the login: Internal Server Error" });
    }
  }
  static async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });
      const otpExpires = new Date(Date.now() + 600000); // OTP expires in 10 minutes
      await User.updateOne({ email }, { otp, otpExpires });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      res.json({ message: "OTP sent to your email" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
      });
      if (!user) {
        return res.status(404).json({ message: "Invalid OTP" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await User.updateOne(
        { email },
        { password: hashedPassword, otp: null, otpExpires: null }
      );
      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async logout(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token
      );
      await req.user.save();
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async logoutAllDevices(req, res) {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.json({ message: "Logged out from all devices successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { _id, username, email } = user;
      res.json({ _id, username, email });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAllUserDetails(req, res) {
    try {
      const users = await User.find();
      const sanitizedUsers = users.map(({ _id, username, email }) => ({
        _id,
        username,
        email,
      }));

      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async updateUserDetails(req, res) {
    const { username, email, newPassword } = req.body;

    try {
      req.user.username = username || req.user.username;
      req.user.email = email || req.user.email;

      if (newPassword) {
        req.user.password = await bcrypt.hash(newPassword, saltRounds);
      }
      await req.user.save();
      res.json({ message: "User details updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default UserController;