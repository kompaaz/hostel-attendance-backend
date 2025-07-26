const express = require("express");
const router = express.Router();
const { userLogin } = require("../controllers/auth.controller");

// login user
router.post("/login", userLogin);

module.exports = router;
