import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

function dateKeyFromNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// TEMP auth: pass user id in header (replace with JWT later)
function requireUser(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ message: "Missing x-user-id header" });
  req.userId = userId;
  next();
}

// GET /api/attendance/today
router.get("/today", requireUser, async (req, res) => {
  const dateKey = dateKeyFromNow();
  const doc = await Attendance.findOne({ userId: req.userId, dateKey }).lean();
  res.json({ dateKey, attendance: doc || null });
});

// POST /api/attendance/checkin
router.post("/checkin", requireUser, async (req, res) => {
  const dateKey = dateKeyFromNow();
  const now = new Date();

  let doc = await Attendance.findOne({ userId: req.userId, dateKey });

  if (doc?.checkInAt) return res.status(400).json({ message: "Already checked in today." });

  if (!doc) {
    doc = await Attendance.create({
      userId: req.userId,
      dateKey,
      checkInAt: now,
      status: "INCOMPLETE",
    });
  } else {
    doc.checkInAt = now;
    doc.status = "INCOMPLETE";
    await doc.save();
  }

  res.status(201).json({ message: "Checked in", attendance: doc });
});

// POST /api/attendance/checkout
router.post("/checkout", requireUser, async (req, res) => {
  const dateKey = dateKeyFromNow();
  const now = new Date();

  const doc = await Attendance.findOne({ userId: req.userId, dateKey });

  if (!doc || !doc.checkInAt) return res.status(400).json({ message: "You must check in first." });
  if (doc.checkOutAt) return res.status(400).json({ message: "Already checked out today." });

  doc.checkOutAt = now;
  doc.status = "PRESENT";
  await doc.save();

  res.json({ message: "Checked out", attendance: doc });
});

export default router;