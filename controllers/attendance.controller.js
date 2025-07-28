const Attendance = require("../models/attendance.model");

const markAttendance = async (req, res) => {
  const ad = req.token.id;
  console.log("this is ad id");

  console.log(ad);
  const { records } = req.body;
  console.log("this is records");

  console.log(records);

  const type = "general";

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
