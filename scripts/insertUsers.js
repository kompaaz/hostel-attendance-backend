const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Student = require("../models/student.model");

const MONGO_URI = "mongodb://127.0.0.1:27017/hostel_attendance";

async function insertInitialUsers() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const users = [
    {
      username: "Augustin",
      password: await bcrypt.hash("1234", 10),
      role: "ad",
      roomsIncharge: {
        hall: ["APH", "SH"],
        from: 21, // start room number
        to: 48, // end room number
      },
    },
    // {
    //   username: "director_father",
    //   password: await bcrypt.hash("father123", 10),
    //   role: "director",
    // },
    // {
    //   username: "ad_john",
    //   password: await bcrypt.hash("john123", 10),
    //   role: "ad",
    //   hall: "St Paul Hall",
    // },
    // {
    //   username: "ad_mary",
    //   password: await bcrypt.hash("mary123", 10),
    //   role: "ad",
    //   hall: "St Thomas Hall",
    // },
  ];

  const students = [
    {
      roll: "22BCS001",
      name: "Noel Sebu",
      room: "A101",
      community: "BC",
      assignedAd: "AD001",
    },
    {
      roll: "22BCS002",
      name: "Rahul Kumar",
      room: "B202",
      community: "MBC",
      assignedAd: "AD002",
    },
    {
      roll: "22BCS003",
      name: "Priya Sharma",
      room: "C303",
      community: "OC",
      assignedAd: "AD001",
    },
    {
      roll: "22BCS004",
      name: "Arjun Reddy",
      room: "D404",
      community: "SC",
      assignedAd: "AD003",
    },
    {
      roll: "22BCS005",
      name: "Sneha Nair",
      room: "E505",
      community: "ST",
      assignedAd: "AD002",
    },
  ];

  // await User.deleteMany({}); // Optional: clear old users
  await User.insertMany(users);
  // await Student.insertMany(students);
  console.log("Users inserted successfully");

  mongoose.disconnect();
}

insertInitialUsers().catch(console.error);
