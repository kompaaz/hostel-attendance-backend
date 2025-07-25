const express = require("express");
const router = express.Router();
const Attendance = require("../../models/Attendance"); // Mongoose model
const Student = require("../models/Student");

//controllers
const { markAttendance } = require("../controllers/attendance.controller");

// @route   POST /api/attendance/mark
// @desc    Mark daily attendance
// @access  Protected (use middleware if needed)
// routes/attendance.js

// POST /api/attendance/mark
router.post("/mark", async (req, res) => {
  const { ad, type, records } = req.body;
  const date = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  if (!ad || !records || !type)
    return res.status(400).json({ error: "Missing fields" });

  try {
    await Attendance.findOneAndUpdate(
      { date, ad, type },
      { $set: { records } },
      { upsert: true }
    );
    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

// GET: Fetch all students
router.get("/students", async (req, res) => {
  try {
    const adId = req.query.adId; // e.g., /students?adId=AD001
    const students = await Student.find({ adId }); // Filter by assigned AD
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET /api/students?ad=ad1
router.get("/", async (req, res) => {
  const { ad } = req.query;
  if (!ad) return res.status(400).json({ error: "Missing ad ID" });

  try {
    const students = await Student.find({ assignedAd: ad });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;
