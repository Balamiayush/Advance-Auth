import { User } from "../models/user.models.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; // Import the token generation function
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
// Signup function to register a new user
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate user input (all fields should be at least 3 characters)
    if (
      ![email, password, name].every((val) => val && val.trim().length >= 3)
    ) {
      return res.status(400).json({ error: "Invalid inputs" });
    }

    // Check if the user already exists in the database by email
    const userAlreadyExists = await User.findOne({ email: email });
    if (userAlreadyExists) {
      // If the user already exists, return a 400 status code with an error message
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the user's password using bcryptjs with a salt factor of 10
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a random 6-digit verification token for email verification
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create a new user instance with hashed password and verification token
    const user = new User({
      email,
      password: hashedPassword, // Store the hashed password
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
    });

    // Save the new user to the database

    await user.save();

    // Generate a JWT token and set it as a cookie (replace the placeholder with the actual token creation logic)
    generateTokenAndSetCookie(res, user._id); // Ensure you're passing the correct arguments to this function

    // Send a success response along with user details (excluding sensitive info like password)
    await sendVerificationEmail(user.email, verificationToken);
    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // Log the error and send a 500 status code in case of server error
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
export const verifyEmail = async (req, res) => {
  //---------- we need code
  const { code } = req.body; // Change this line to destructure the code from the body
  try {
    const user = await User.findOne({
      verificationToken: code, // Ensure code is a string
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    user.isVerified = true;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const login = async (req, res) => {
  // Logic to send a signup request to the server
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });
    const isPasswordValid = bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid email or password" });
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
  // Return the response from the server
};
export const logout = async (req, res) => {
  // Logic to send a signup request to the server
  res.clearCookie("token");
  // Return the response from the server
  res.json({ message: "Logged out successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 + 60 * 60 * 1000; //1hrs
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;
    await user.save();
    await sendResetPasswordEmail(
      user.email,
      ` ${process.env.CLIENT_URL}/reset-password${resetToken}`
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Destructure token from req.params
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    // Update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpiresAt = undefined; // Clear the expiration
    await user.save();
    await sendResetSuccessEmail(user.email);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findOne(req.userId).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json({
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
