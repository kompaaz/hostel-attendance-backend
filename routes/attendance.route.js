const express = require("express");
const router = express.Router();

// middlewares
const { verifyToken } = require("../middleware/auth.middleware");

//controllers
const {
  markAttendance,
  getStudentsAccordingToAd,
} = require("../controllers/attendance.controller");
const { getStudents } = require("../controllers/student.controller");

router.get("/", verifyToken, getStudentsAccordingToAd); // POST /api/attendance/
router.post("/mark", verifyToken, markAttendance); // POST /api/attendance/mark
router.get("/students", getStudents); // GET: Fetch all students based on adId

module.exports = router;
