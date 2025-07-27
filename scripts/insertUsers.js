const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Student = require("../models/student.model");

const MONGO_URI = "mongodb://127.0.0.1:27017/hostel_attendance";

async function insertInitialUsers() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const users = [
    // {
    //   username: "Augustin",
    //   password: await bcrypt.hash("1234", 10),
    //   role: "ad",
    //   roomsIncharge: {
    //     hall: ["APH", "SH"],
    //     from: 21, // start room number
    //     to: 48, // end room number
    //   },
    // },
    // {
    //     username: "Philips",
    //     password: await bcrypt.hash("1234", 10),
    //     role: "ad",
    //     roomsIncharge: {
    //         from: 49, // start room number
    //         to: 100, // end room number
    //     }
    // },
    {
        username: "Rex",
        password: await bcrypt.hash("1234", 10),
        role: "ad",
        roomsIncharge: {
            hall: ["Beschi Hall", "Britto Hall", "Loyola Hall", "Xavier Hall"],
            from: 2,
            to: 20,
        }
    }
  ];



  // await User.deleteMany({}); // Optional: clear old users
  await User.insertMany(users);
  // await Student.insertMany(students);
  console.log("Users inserted successfully");

  mongoose.disconnect();
}

insertInitialUsers().catch(console.error);
