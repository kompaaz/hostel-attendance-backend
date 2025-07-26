const express = require("express");
const router = express.Router();
const Students = require("../models/student.model");

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin } = require("../controllers/auth.controller");

// login user
router.get("/login", async (req, res) => {
  const student = await Students.find();
  console.log(student);

  res.render("login", { users: student });
});
router.post("/login", isUserLoggedIn, userLogin);

module.exports = router;
