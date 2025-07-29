const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const User = require("../models/user.model"); // For Assistant Director (AD) name

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin } = require("../controllers/auth.controller");

// login user
router.get("/login", async (req, res) => {
  res.render("login");
});
router.post("/login", isUserLoggedIn, userLogin);

router.get("/logout", (req, res) => {

  res.cookie("token", "", {
    httpOnly: true,
    secure: true, // ✅ Required on Vercel (HTTPS)
    sameSite: "None", // ✅ Required for cross-origin cookie
    maxAge: 0, // Optional: 1 day
  });
  // res.redirect("https://sh.devnoel.org/logout");
  // res.redirect("http://localhost:3000/logout");
  res.status(200).json({ message: "logout successfull" });
});

router.get("/student_list", async (req, res) => {
  const students = await Students.find();
  res.render("student_list", { users: students });
});

router.get("/display_attendance", async (req, res) => {
  try {
    // const attendance = await Attendance.find();
    const attendance = await Attendance.find()
      .populate("ad", "username")
      .sort({ date: -1 });
    // console.log(JSON.stringify(attendance));

    // res.send("attendance");
    // res.render("attendance_list", { attendance });
    res.json({ "attendance-records": attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
