import { User } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; // Import the token generation function

// Signup function to register a new user
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate user input (all fields should be at least 3 characters)
    if (![email, password, name].every((val) => val && val.trim().length >= 3)) {
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
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

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

export const login = async (req, res) => {
  // Logic to send a signup request to the server
  // Return the response from the server
};
export const logout = async (req, res) => {
  // Logic to send a signup request to the server
  // Return the response from the server
};