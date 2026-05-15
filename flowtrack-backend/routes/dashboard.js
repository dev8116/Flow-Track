import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/dashboard
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).select("name email role createdAt");
    if (!me) return res.status(404).json({ message: "User not found" });

    // Demo stats (replace with real project/task queries later)
    const stats = {
      totalProjects: me.role === "admin" ? 12 : 3,
      totalTasks: me.role === "admin" ? 58 : 14,
      pendingLeaves: me.role === "admin" ? 4 : 1,
      attendanceToday: "Present",
    };

    return res.json({
      user: me,
      stats,
      message: `Welcome ${me.name}!`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;