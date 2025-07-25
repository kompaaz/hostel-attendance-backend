const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  roll: {
    type: String,
  },
  // roll: String,
  name: String,
  room: String,
  community: String,
  assignedAd: String,
});

module.exports = mongoose.model("Student", studentSchema);
