import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectionDB.js";
import authRoutes from "./Routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());

app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable cors

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  connectDB();
  console.log("Connect");
  console.log(`Server running on port ${PORT}`);
});
