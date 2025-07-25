// routes/students.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Student = require("../models/Student");

// GET all students for a specific AD
router.get("/", verifyToken, async (req, res) => {
  try {
    const adUsername = req.user.username;
    const students = await Student.find({ assignedAD: adUsername });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
