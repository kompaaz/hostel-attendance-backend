const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// routers
const authRoutes = require("../routes/auth.route");
const studentRoutes = require("../routes/students");
const attendanceRoutes = require("../routes/attendance.route");

const app = express();

// Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // updated path
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public"))); // static folder

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Example EJS route
app.get("/", (req, res) => {
  res.render("home", { title: "Hosted on Vercel" });
});

// MongoDB connection — only once
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  }
  next();
});

// Export serverless handler
module.exports = app;
module.exports.handler = serverless(app);
