const express = require("express");
const router = express.Router();

//controllers
const { markAttendance } = require("../controllers/attendance.controller");
const { getStudents } = require("../controllers/student.controller");

// POST /api/attendance/mark
router.get("/", (req, res) => {
  res.render("attendance");
});
router.post("/mark", markAttendance);

// GET: Fetch all students based on adId
router.get("/students", getStudents);

module.exports = router;
