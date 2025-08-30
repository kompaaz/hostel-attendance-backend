const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { getStudentsAccordingToAd, updateStudentRoom } = require("../controllers/attendance.controller");
const { getAttendanceByStudent } = require("../controllers/student.controller");

// 🔹 Get students assigned to logged-in AD
router.get("/", verifyToken, getStudentsAccordingToAd);

// 🔹 Update student room
router.put("/update-room", verifyToken, updateStudentRoom);


router.get("/getAttendanceByStudent", verifyToken, getAttendanceByStudent);

module.exports = router;
