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
      console.log("❌ Could not get connection URI from .env");
      throw new Error("URI not defined in .env");
    }

    await mongoose.connect(URI);

    isConnected = mongoose.connections[0].readyState === 1;
    if (isConnected) {
      console.log("✅ Successfully connected to database");
    } else {
      console.log("⚠️ Database connection not ready");
    }
  } catch (error) {
    console.log(`❌ Error in db.js while connecting to DB`);
    console.error(error);
    // Optional: process.exit(1); to stop the app
  }
};

module.exports = connectDB;
