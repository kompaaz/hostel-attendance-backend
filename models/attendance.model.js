const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date, // Store as native Date type
    required: true,
    default: Date.now, // Optional default
  }, // "YYYY-MM-DD"
  ad: String,
  type: String, // "general" or "mass"
  records: [
    {
      accountNumber: String,
      status: String, // "present" or "absent"
    },
  ],
});

module.exports = mongoose.model("attendance", attendanceSchema);
