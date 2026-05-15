import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "User" },

    // store per-day record
    dateKey: { type: String, required: true, index: true }, // e.g. "2026-05-06"

    checkInAt: { type: Date, default: null },
    checkOutAt: { type: Date, default: null },

    status: { type: String, enum: ["PRESENT", "INCOMPLETE"], default: "INCOMPLETE" },
  },
  { timestamps: true }
);

// prevent duplicates per day
AttendanceSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);