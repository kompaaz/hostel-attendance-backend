const express = require("express");
const router = express.Router();
// const Attendance = require("../../models/Attendance"); // Mongoose model
const Student = require("../models/student.model");

//controllers
const { markAttendance } = require("../controllers/attendance.controller");
const { getStudents } = require("../controllers/student.controller");

// @route   POST /api/attendance/mark
// @desc    Mark daily attendance
// @access  Protected (use middleware if needed)
// routes/attendance.js

// POST /api/attendance/mark
router.post("/mark", markAttendance);

// GET: Fetch all students based on adId
router.get("/students", getStudents);

// GET /api/students?ad=ad1
// router.get("/", async (req, res) => {
//   const { ad } = req.query;
//   if (!ad) return res.status(400).json({ error: "Missing ad ID" });

//   try {
//     const students = await Student.find({ assignedAd: ad });
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch students" });
//   }
// });

module.exports = router;
