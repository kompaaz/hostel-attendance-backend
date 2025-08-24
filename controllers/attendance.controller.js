const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");
const Students = require("../models/student.model");
const Leave = require("../models/leave.model");

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

    // Fetch all students under this AD
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

    // ✅ Fetch approved leaves for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const approvedLeaves = await Leave.find({
      status: { $in: ["approved", "approved_by_director"] },
      fromDate: { $lte: todayEnd },
      toDate: { $gte: todayStart },
    }).lean();




    // Create a set of studentIds who are on leave
    const leaveStudentIds = new Set(approvedLeaves.map(l => l.student.toString()));
    // console.log("Students:", students.map(s => s._id.toString()));
    // console.log("Leave IDs:", Array.from(leaveStudentIds));

    // Group students by room and mark leave
    const groupedUsers = {};
    students.forEach((student) => {
      const room = student.roomNo || "Unknown";
      if (!groupedUsers[room]) groupedUsers[room] = [];

      groupedUsers[room].push({
        ...student,
        leave: leaveStudentIds.has(student._id.toString()) ? true : false,
      });
    });

    res.json({ students: groupedUsers });
  } catch (error) {
    console.error(
      "Error in Getting Students according to ad in attendance controller: \n",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAttendanceRecords = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);

    const attendance = await Attendance.find({ date: { $gte: twoDaysAgo } })
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
