const express = require("express");
const router = express.Router();

// middleware
const { isUserLoggedIn } = require("../middleware/auth.middleware");

// controllers
const { userLogin } = require("../controllers/auth.controller");

// login user
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", isUserLoggedIn, userLogin);

module.exports = router;
