const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  dNo: String,
  accNo: Number,
  name: String,
  roomNo: String,
  religion: String,
  assignedAd: String,
  parentNo: String,
  studentNo: String,
});

module.exports = mongoose.model("student", studentSchema);
