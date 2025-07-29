const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");
const Students = require("../models/student.model");

const markAttendance = async (req, res) => {
  const ad = req.token.id;
  const type = "general";
  const { records } = req.body;

  if (!ad || !records || !type)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const attendance = new Attendance({ ad, type, records });
    attendance.save();

    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.log("Error in attendance.controller.js \n" + err);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};

const getStudentsAccordingToAd = async (req, res) => {
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

    res.json({ students: groupedUsers });
  } catch (error) {
    console.error("Error fetching students: \n", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendanceRecords = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("ad", "username")
      .sort({ date: -1 });

    res.status(200).json({ "attendance-records": attendance });
  } catch (error) {
    console.error("Error fetching attendance: \n", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  markAttendance,
  getStudentsAccordingToAd,
  getAttendanceRecords,
};
