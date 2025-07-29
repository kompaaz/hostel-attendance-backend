const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("✅ Reusing existing database connection");
      return;
    }

    const URI = process.env.MONGO_URI;
    if (!URI) {
      console.log("could not get connection URI db.js");
      throw new Error("URI not defined in .env");
    }
    // console.log(URI);
    await mongoose.connect(URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("SUCCESSFULLY CONNECTED TO DATABASE");
  } catch (error) {
    console.log(`Error in db.js while connecting to db`);
    console.log(error);
    // process.exit(1);
  }
};

module.exports = connectDB;