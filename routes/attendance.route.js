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

    const halls = user.roomsIncharge?.hall || [];
    const from = parseInt(user.roomsIncharge?.from);
    const to = parseInt(user.roomsIncharge?.to);

    const matchConditions = [];

    if (Array.isArray(halls) && halls.length > 0) {
      matchConditions.push({
        $and: [
          { roomNo: { $in: halls } },
          { roomNo: { $not: { $regex: /\d/ } } },
        ],
      });
    }

    if (!isNaN(from) && !isNaN(to)) {
      matchConditions.push({
        numericRoom: { $gte: from, $lte: to },
      });
    }

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
          $or: matchConditions,
        },
      },
    ]);

    const groupedUsers = {};
    students.forEach((student) => {
      const room = student.roomNo || "Unknown";
      if (!groupedUsers[room]) groupedUsers[room] = [];
      groupedUsers[room].push(student);
    });

    // ✅ Send JSON instead of rendering a view
    res.json({ students: groupedUsers });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/mark", verifyToken, markAttendance);

// GET: Fetch all students based on adId
router.get("/students", getStudents);

module.exports = router;
