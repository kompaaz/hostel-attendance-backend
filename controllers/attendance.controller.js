const Attendance = require("../models/attendance.model");

const markAttendance = async (req, res) => {
  const { ad, type, records } = req.body;
  const date = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

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

module.exports = { markAttendance };
