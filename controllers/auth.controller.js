const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userLogin = async (req, res) => {
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

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ Required on Vercel (HTTPS)
      sameSite: "None", // ✅ Required for cross-origin cookie
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    console.error("Error in userLogin controller \n", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userLogin };
