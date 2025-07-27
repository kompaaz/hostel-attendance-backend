const express = require("express");
const router = express.Router();

const Students = require("../models/student.model");
const User = require("../models/user.model");

const { verifyToken } = require("../middleware/auth.middleware");

//controllers
const { markAttendance } = require("../controllers/attendance.controller");
const { getStudents } = require("../controllers/student.controller");

// POST /api/attendance/mark
router.get("/", verifyToken, async (req, res) => {
  try {
    const adId = req.token.id;
    const user = await User.findById(adId);
    console.log(user.roomsIncharge.hall);

    // const students = await Students.find();

    const students = await Students.aggregate([
      {
        $addFields: {
          numericRoom: {
            $cond: {
              if: { $regexMatch: { input: "$roomNo", regex: /^[0-9]+$/ } },
              then: { $toInt: "$roomNo" },
              else: null,
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { roomNo: { $in: user.roomsIncharge.hall } },
            {
              numericRoom: {
                $gte: user.roomsIncharge.from,
                $lte: user.roomsIncharge.to,
              },
            },
          ],
        },
      },
    ]);

    // console.log(students);

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
