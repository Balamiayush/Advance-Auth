import jwt from "jsonwebtoken"; // Ensure you have this package installed

// Function to generate JWT and set it as a cookie
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  // Set the JWT as a cookie
  res.cookie("token", token, {
    httpOnly: true, // Ensures the cookie is only accessible by the web server
    secure: process.env.NODE_ENV === "production", // Set to true in production
    maxAge: 3600000, // 1 hour in milliseconds
  });
};
