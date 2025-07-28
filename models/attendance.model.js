const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date, // Store as native Date type
    required: true,
    default: Date.now, // Optional default
  }, // "YYYY-MM-DD"
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // this should match the name of the model you have defined for ADs
  },
  type: String, // "general" or "mass"
  records: [
    {
      name: String,
      accountNumber: String,
      status: String, // "present" or "absent"
    },
  ],
});

module.exports = mongoose.model("attendance", attendanceSchema);
