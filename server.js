import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import searchRoutes from "./routes/search.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", searchRoutes);

let connPromise;
async function ensureDb() {
  if (!connPromise) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set. Please set it in your environment.");
    }
    console.log("Connecting to MongoDB");
    connPromise = mongoose.connect(mongoUri);
  }
  await connPromise;
}

// Vercel serverless function entry
export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}

// Local server entry (only when not running as serverless)
if (process.env.VERCEL !== "1") {
  ensureDb()
    .then(() => {
      app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}