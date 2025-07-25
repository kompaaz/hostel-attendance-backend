const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: String, // "YYYY-MM-DD"
  ad: String,
  type: String, // "general" or "mass"
  records: [
    {
      roll: String,
      status: String, // "present" or "absent"
    },
  ],
});

module.exports = mongoose.model("attendance", attendanceSchema);
