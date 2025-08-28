// controllers/leaveController.js
const LeaveRequest = require("../models/leave.model");
const User = require("../models/user.model");

// Student applies for leave
exports.applyLeave = async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;
        const studentId = req.token.id; // from verifyToken

        const leave = new LeaveRequest({
            student: studentId,
            fromDate,
            toDate,
            reason,
        });

        await leave.save();
        res.status(201).json({ message: "Leave request submitted", leave });
    } catch (error) {
        res.status(500).json({ error: "Error applying leave" });
    }
};

// Director approves/rejects
exports.directorAction = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { action, rejectionReason, assignedAD } = req.body; // action = "approve" / "reject"

        const leave = await LeaveRequest.findById(leaveId);
        if (!leave) return res.status(404).json({ error: "Leave not found" });

        if (action === "approve") {
            leave.status = "approved_by_director"; // Changed from "Approved"
            // leave.approvedByDirector = true; // Remove this - not in schema
            leave.director = req.token.id;
            leave.assignedAD = assignedAD;
        } else if (action === "reject") {
            leave.status = "rejected"; // Changed from "Rejected"
            leave.rejectionReason = rejectionReason;
            leave.director = req.token.id;
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }

        await leave.save();
        res.json({ message: `Leave ${action}d successfully`, leave });
    } catch (error) {
        res.status(500).json({ error: "Error in director action" });
    }
};

// AD checks approved leave
exports.adCheck = async (req, res) => {
    try {
        const { leaveId } = req.params;

        const leave = await LeaveRequest.findById(leaveId);
        if (!leave) return res.status(404).json({ error: "Leave not found" });

        if (!leave.approvedByDirector)
            return res
                .status(400)
                .json({ error: "Director approval required before AD check" });

        leave.checkedByAD = true;
        await leave.save();

        res.json({ message: "AD has checked the leave", leave });
    } catch (error) {
        res.status(500).json({ error: "Error in AD check" });
    }
};

// Fetch all leaves (optional: for director/ad dashboards)
exports.getLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find()
            .populate("student", "name role")
            .populate("director", "name role")
            .populate("assignedAD", "name role");
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ error: "Error fetching leaves" });
    }
};
