const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  console.log("req came to login");

  try {
    const { username, password } = req.body;

    // ✅ Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Login success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        hall: user.hall || null,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
