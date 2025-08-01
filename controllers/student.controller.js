const Student = require("../models/student.model");
// DONT KNOW WHY THIS ROUTE EXISTS
const getStudents = async (req, res) => {
  try {
    console.log("trying to get students");
    const adId = req.query.adId; // e.g., /students?adId=AD001
    const students = await Student.find({ assignedAd: adId }); // Filter by assigned AD
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

module.exports = { getStudents };
