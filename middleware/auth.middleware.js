const jwt = require("jsonwebtoken");

const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      return res.status(200).json({ message: "already logged In" });
    }

    next();
  } catch (error) {
    console.log("Error in isUserLoggedIn middleware \n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = { verifyToken, isUserLoggedIn };
