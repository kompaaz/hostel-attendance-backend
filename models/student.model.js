const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  dNo: String,
  accNo: Number,
  name: String,
  roomNo: String,
  religion: String,
  assignedAd: String,
  parentNo: Long,
  studentNo: Long,
});

module.exports = mongoose.model("student", studentSchema);
