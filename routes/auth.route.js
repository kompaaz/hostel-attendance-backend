const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin, logout } = require("../controllers/auth.controller");

// login user
router.get("/login", async (req, res) => {
  res.render("login");
});
router.post("/login", isUserLoggedIn, userLogin); // POST /api/auth/login
router.get("/logout", logout);  // GET /api/auth/logout

module.exports = router;