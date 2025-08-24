const Student = require("../models/student.model");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendance.model");
const getStudents = async (req, res) => {
  try {
    console.log("trying to get students");
    const adId = req.query.adId;
    const students = await Student.find({ assignedAd: adId });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Student.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Attendance removed, just return profile now
    res.status(200).json(user);

  } catch (error) {
    console.error("❌ Error in getMe controller:\n", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance for a specific student
const getAttendanceByStudent = async (req, res) => {
  try {
    console.log("Fetching attendance by accountNo");

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id).select("name dNo accNo");

    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ Use aggregation to filter the records array
    const attendanceDocs = await Attendance.aggregate([
      {
        $match: {
          "records.accountNumber": String(student.accNo)
        }
      },
      {
        $addFields: {
          records: {
            $filter: {
              input: "$records",
              as: "record",
              cond: {
                $eq: ["$$record.accountNumber", String(student.accNo)]
              }
            }
          }
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    // console.log(JSON.stringify(attendanceDocs));

    const filteredAttendance = attendanceDocs.map((entry) => ({
      date: entry.date,
      type: entry.type,
      status: entry.records[0]?.status || "N/A",
    }));

    // console.log(JSON.stringify(filteredAttendance));
    res.status(200).json({ student, attendance: filteredAttendance });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { getStudents, getMe, getAttendanceByStudent };
