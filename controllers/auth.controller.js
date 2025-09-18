const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Student = require("../models/student.model");

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let account = null;
    let roleType = "";

    // 1. Check in User collection (admins)
    account = await User.findOne({ username });
    if (account) {
      roleType = account.role;
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // 2. If not found in User, check Student collection
    if (!account) {
      account = await Student.findOne({ dNo: username });
      if (account) {
        roleType = "student";
        if (account.password !== password) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }
    }

    // 3. If still not found
    if (!account) {
      return res.status(400).json({ message: "User not found" });
    }

    // 4. Generate JWT and set token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ id: account._id, role: roleType }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 60 * 60 * 1000,   // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: account._id,
        username: account.username || account.name,
        role: roleType,
      },
    });

  } catch (err) {
    console.error("Error in userLogin controller \n", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {

  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logout successful" });
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select("-password");

    if (!user) {
      user = await Student.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);


  } catch (error) {
    console.error("❌ Error in getMe controller:\n", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userLogin, logout, getMe };
