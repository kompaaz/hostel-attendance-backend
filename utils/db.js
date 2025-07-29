const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    if(!URI){
      console.log("could not get connection URI db.js");
      throw new Error("URI not defined in .env")
    }
    await mongoose.connect(URI);
    console.log("Successfully conected to database");
  } catch (error) {
    console.log(`Error in db.js while connecting to db`);
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;