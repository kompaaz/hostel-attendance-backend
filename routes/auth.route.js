const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin } = require("../controllers/auth.controller");

// login user
router.get("/login", async (req, res) => {
  res.render("login");
});
router.post("/login", isUserLoggedIn, userLogin);


router.get("/student_list", async (req, res) => {
  const students = await Students.find();
  res.render("student_list", { users: students });
});

module.exports = router;
