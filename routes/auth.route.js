const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");       // For Assistant Director (AD) name

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
    maxAge: 0,
  });
  res.redirect("/api/auth/login");
});

router.get("/student_list", async (req, res) => {
  const students = await Students.find();
  res.render("student_list", { users: students });
});

router.get("/display_attendance", async (req, res) => {
  try {
    const attendanceData = await Attendance.find().lean();
    const users = await User.find().lean();
    const students = await Students.find().lean();
    console.log("Attendance Data:", attendanceData);


    // Create quick lookup maps
    const adMap = Object.fromEntries(users.map(user => [user._id.toString(), user.name]));
    const studentMap = Object.fromEntries(students.map(stu => [stu.accountNumber, stu.name]));
    console.log("Student Map:", studentMap);
    // Group attendance by AD
    const groupedByAD = {};

    attendanceData.forEach((entry) => {
      const adId = entry.ad?.toString();
      const adName = adMap[adId] || "Unknown AD";

      if (!groupedByAD[adId]) {
        groupedByAD[adId] = { name: adName, records: [] };
      }

      // Replace accountNumber with student name
      const updatedRecords = entry.records.map((rec) => ({
        ...rec,
        name: studentMap[rec.accountNumber] || "Unknown Student",
      }));

      groupedByAD[adId].records.push({
        date: entry.date,
        records: updatedRecords,
      });
    });

    res.render("attendance_list", { groupedByAD });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
