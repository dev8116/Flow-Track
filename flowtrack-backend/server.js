import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import attendanceRoutes from "./routes/attendance.js";
import reportsRoutes from "./routes/reports.js"; // ✅ NEW

dotenv.config();

const app = express();

app.use(express.json());

// Allow CRA (3000) and Vite (5173)
app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN, // optional
      "http://localhost:3000",
      "http://localhost:5173",
    ].filter(Boolean),
    credentials: true,
  })
);

// routes
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportsRoutes); // ✅ NEW

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI in .env");
    if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();