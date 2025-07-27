const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin } = require("../controllers/auth.controller");
const { route } = require("./auth.route");

// login user
router.get("/login", async (req, res) => {
  const students = await Students.find();
  res.render("login", { users: students });
});
router.post("/login", isUserLoggedIn, userLogin);


router.get("/student_list", async (req, res) => {
  const students = await Students.find();
  res.render("student_list", { users: students });
});

router.get("/ad_attendance", async (req, res) => {
  try {
    const students = await Students.find();

    // Group by roomNo
    const groupedUsers = {};

    students.forEach((student) => {
      const room = student.roomNo || "Unknown";
      if (!groupedUsers[room]) {
        groupedUsers[room] = [];
      }
      groupedUsers[room].push(student);
    });

    res.render("ad_attendance", { groupedUsers });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;
