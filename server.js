require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// routers
const authRoutes = require("./routes/auth.route");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance.route");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true,               // Allow cookies
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

module.exports = app;
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log("Listening on PORT : " + PORT);
// });
