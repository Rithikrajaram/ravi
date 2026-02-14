const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Task.aggregate([
            { $match: { assignee: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const overdueCount = await Task.countDocuments({
            assignee: userId,
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        const priorityStats = await Task.aggregate([
            { $match: { assignee: userId } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            statusStats: stats,
            overdueCount,
            priorityStats,
            productivityScore: req.user.productivityScore
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamPerformance = async (req, res) => {
    try {
        // Admin/Manager only logic
        const teamStats = await Task.aggregate([
            {
                $group: {
                    _id: "$assignee",
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    name: "$userInfo.name",
                    completed: 1,
                    total: 1,
                    performanceRate: {
                        $multiply: [{ $divide: ["$completed", "$total"] }, 100]
                    }
                }
            }
        ]);

        res.json(teamStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
