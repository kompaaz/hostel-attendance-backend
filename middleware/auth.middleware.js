const jwt = require("jsonwebtoken");
require("dotenv").config();

const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      return res.redirect("/api/auth/login");
    }
    next();
  } catch (error) {
    console.log("Error in isUserLoggedIn middleware \n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // ✅ FIXED

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = { verifyToken, isUserLoggedIn };
