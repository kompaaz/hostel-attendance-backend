const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["director", "ad", "admin"], required: true },
  roomsIncharge: {
    hall: [],
    from: Number, // start room number
    to: Number, // end room number
  },
  createdAt: { type: Date, default: Date.now },
});

// Check password method
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
