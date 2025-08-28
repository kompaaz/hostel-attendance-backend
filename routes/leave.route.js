// routes/leave.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const Leave = require("../models/leave.model");
const User = require("../models/user.model");


// 📌 Create leave request
router.post("/", verifyToken, async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;

        const leave = new Leave({
            student: req.token.id, // userId from token
            fromDate,
            toDate,
            reason,
        });

        await leave.save();
        res.status(201).json({ success: true, leave });
    } catch (err) {
        console.error("Error creating leave request:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get my leave requests
// router.get("/my-requests", verifyToken, async (req, res) => {
//     try {
//         console.log("Fetching leave requests for student:", req.token.id);

//         const leaves = await Leave.find({ student: req.token.id }).sort({
//             createdAt: -1,
//         });

//         console.log("Found leave requests:", leaves.length);

//         // ✅ Log the actual leave data if you want to see details
//         console.log("Leave requests:", leaves);

//         res.json({ success: true, leaves });
//     } catch (err) {
//         console.error("Error fetching leaves:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// 📌 Get my leave requests - FIXED VERSION
router.get("/my-requests", verifyToken, async (req, res) => {
    try {
        // console.log("Fetching leave requests for student:", req.token.id);

        // Since your Leave model references "User", but you're using student ID
        // We need to check what model your student IDs actually belong to

        const leaves = await Leave.find({ student: req.token.id })
            .populate('student', 'name accNo roomNo') // Populate student details
            .populate('director', 'name') // Populate director details if exists
            .populate('assignedAD', 'name') // Populate AD details if exists
            .sort({ appliedAt: -1 });

        // console.log("Found leave requests:", leaves.length);

        // ✅ Log the actual leave data for debugging
        // if (leaves.length > 0) {
        //     console.log("Sample leave request:", {
        //         id: leaves[0]._id,
        //         student: leaves[0].student,
        //         fromDate: leaves[0].fromDate,
        //         toDate: leaves[0].toDate,
        //         status: leaves[0].status
        //     });
        // }

        res.json({
            success: true,
            leaves,
            message: leaves.length === 0 ? "No leave requests found" : "Leave requests retrieved successfully"
        });

    } catch (err) {
        console.error("Error fetching leaves:", err);
        res.status(500).json({
            error: "Internal Server Error",
            details: err.message
        });
    }
});

router.post("/apply", verifyToken, async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;

        const leave = new Leave({
            student: req.token.id,
            fromDate,
            toDate,
            reason,
        });

        await leave.save();
        res.status(201).json({ success: true, leave });
    } catch (err) {
        console.error("Error creating leave request:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Director approves/rejects leave
// 📌 Director approves/rejects leave - FIXED VERSION
router.post("/:leaveId/action", verifyToken, async (req, res) => {
    try {
        // console.log("Director action request:", {
        //     leaveId: req.params.leaveId,
        //     body: req.body,
        //     token: req.token
        // });

        const { leaveId } = req.params;
        const { action, rejectionReason, assignedAD } = req.body;

        // Validate required fields
        if (!action) {
            return res.status(400).json({ error: "Action is required" });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            // console.log("Leave not found:", leaveId);
            return res.status(404).json({ error: "Leave not found" });
        }

        // console.log("Current leave status:", leave.status);

        if (action === "approve") {
            // For approve action, assignedAD is optional but recommended
            leave.status = "approved_by_director";
            leave.director = req.token.id;
            leave.assignedAD = assignedAD || null; // Handle case where assignedAD is not provided
            leave.approvedByDirector = true; // Update the schema field

            // console.log("Approving leave with AD:", assignedAD);
        } else if (action === "reject") {
            if (!rejectionReason) {
                return res.status(400).json({ error: "Rejection reason is required" });
            }
            leave.status = "rejected";
            leave.rejectionReason = rejectionReason;
            leave.director = req.token.id;

            // console.log("Rejecting leave with reason:", rejectionReason);
        } else {
            return res.status(400).json({ error: "Invalid action. Use 'approve' or 'reject'" });
        }

        await leave.save();
        // console.log("Leave updated successfully:", leave.status);

        res.json({
            success: true,
            message: `Leave ${action}ed successfully`,
            leave
        });
    } catch (err) {
        console.error("Error in director action:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 AD checks approved leave
router.post("/:leaveId/ad-check", verifyToken, async (req, res) => {
    try {
        const { leaveId } = req.params;

        const leave = await Leave.findById(leaveId);
        if (!leave) return res.status(404).json({ error: "Leave not found" });

        if (leave.status !== "approved_by_director") {
            return res.status(400).json({ error: "Director approval required before AD check" });
        }

        // If you add checkedByAD to schema
        // leave.checkedByAD = true;

        // Or update status if you want to track AD check
        leave.status = "approved_by_ad"; // You might want to add this to enum

        await leave.save();
        res.json({ success: true, message: "AD has checked the leave", leave });
    } catch (err) {
        console.error("Error in AD check:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get all leaves (for director/AD dashboard)
router.get("/all", verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate("student", "name accNo roomNo")
            .populate("director", "name")
            .populate("assignedAD", "name")
            .sort({ appliedAt: -1 });
        // console.log(leaves)
        res.json({ success: true, leaves });

    } catch (err) {
        console.error("Error fetching leaves:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ AD fetch approved leaves
router.get("/ad/leaves", verifyToken, async (req, res) => {
    try {
        if (req.token.role !== "ad") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const ad = await User.findById(req.token.id);

        const halls = ad.roomsIncharge?.hall || [];
        const from = parseInt(ad.roomsIncharge?.from);
        const to = parseInt(ad.roomsIncharge?.to);

        // Build room matching conditions
        const matchConditions = [];

        if (Array.isArray(halls) && halls.length > 0) {
            matchConditions.push({ roomNo: { $in: halls } });
        }

        if (!isNaN(from) && !isNaN(to)) {
            matchConditions.push({
                numericRoom: { $gte: from, $lte: to },
            });
        }

        // Fetch leaves where student room matches AD's rooms
        const leaves = await Leave.aggregate([
            {
                $match: { status: "approved_by_director" }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $addFields: {
                    numericRoom: {
                        $cond: {
                            if: { $regexMatch: { input: "$student.roomNo", regex: /^[0-9]+$/ } },
                            then: { $toInt: "$student.roomNo" },
                            else: null
                        }
                    }
                }
            },
            {
                $match: {
                    $or: matchConditions
                }
            },
            {
                $project: {
                    student: { name: 1, accNo: 1, roomNo: 1 },
                    reason: 1,
                    appliedAt: 1,
                    status: 1,
                    fromDate: 1,   // ✅ include fromDate
                    toDate: 1      // ✅ include toDate
                }
            },
            { $sort: { appliedAt: -1 } }
        ]);


        res.json({ success: true, leaves });
    } catch (err) {
        console.error("Error fetching AD leaves:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;
