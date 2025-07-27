const express = require("express");
const router = express.Router();

const Students = require("../models/student.model")

//controllers
const { markAttendance } = require("../controllers/attendance.controller");
const { getStudents } = require("../controllers/student.controller");

// POST /api/attendance/mark
router.get("/", async (req, res) => {
  try {
    const students = await Students.find();

    // Group by roomNo
    const groupedUsers = {};

    students.forEach((student) => {
      const room = student.roomNo || "Unknown";
      if (!groupedUsers[room]) {
        groupedUsers[room] = [];
      }
      groupedUsers[room].push(student);
    });
    // console.log(groupedUsers);
    res.render("ad_attendance", { groupedUsers });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/mark", markAttendance);

// GET: Fetch all students based on adId
router.get("/students", getStudents);

module.exports = router;
