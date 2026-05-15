import express from "express";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function dateKeyFromNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * GET /api/reports/summary
 * Admin: can see total user count + attendance summary
 * Others: only attendance summary
 */
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const dateKey = dateKeyFromNow();

    const recentAttendance = await Attendance.find({ dateKey })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const totalCheckInsToday = await Attendance.countDocuments({
      dateKey,
      checkInAt: { $ne: null },
    });

    const totalCheckOutsToday = await Attendance.countDocuments({
      dateKey,
      checkOutAt: { $ne: null },
    });

    const presentToday = await Attendance.countDocuments({
      dateKey,
      status: "PRESENT",
    });

    let totalUsers = null;
    if (req.user?.role === "admin") {
      totalUsers = await User.countDocuments({});
    }

    return res.json({
      dateKey,
      summary: {
        totalUsers,
        totalCheckInsToday,
        totalCheckOutsToday,
        presentToday,
      },
      recentAttendance,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;