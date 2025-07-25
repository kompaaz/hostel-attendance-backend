const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/hostel_attendance";

async function insertInitialUsers() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const users = [
    {
      username: "director_father",
      password: await bcrypt.hash("father123", 10),
      role: "director",
    },
    {
      username: "ad_john",
      password: await bcrypt.hash("john123", 10),
      role: "ad",
      hall: "St Paul Hall",
    },
    {
      username: "ad_mary",
      password: await bcrypt.hash("mary123", 10),
      role: "ad",
      hall: "St Thomas Hall",
    },
  ];

  await User.deleteMany({}); // Optional: clear old users
  await User.insertMany(users);
  console.log("Users inserted successfully");

  mongoose.disconnect();
}

insertInitialUsers().catch(console.error);
