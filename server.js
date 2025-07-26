require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

<<<<<<< HEAD
=======
// routers
>>>>>>> df86ca21036f2e8ea10e10246648ce4a6fb0d72e
const authRoutes = require("./routes/auth.route");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance.route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Listening on PORT : " + PORT);
});
