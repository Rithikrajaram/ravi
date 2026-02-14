const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const { getIO } = require('../sockets/socketHandler');

const logActivity = async (taskId, userId, action, details) => {
    await ActivityLog.create({
        task: taskId,
        user: userId,
        action,
        details
    });
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, project, assignee, dependencies, tags } = req.body;

        // AI Mock Logic: Suggest priority based on description keywords
        let suggestedPriority = priority;
        if (description?.toLowerCase().includes('urgent') || description?.toLowerCase().includes('asap')) {
            suggestedPriority = 'critical';
        }

        const task = await Task.create({
            title,
            description,
            priority: suggestedPriority,
            dueDate,
            project,
            assignee,
            dependencies,
            tags,
            creator: req.user._id,
            aiSuggestedPriority: suggestedPriority
        });

        await logActivity(task._id, req.user._id, 'created', { newValue: task.title });

        // Real-time update
        const io = getIO();
        if (project) {
            io.to(project.toString()).emit('task_created', task);
        }
        io.emit('notification', { message: `New task assigned: ${task.title}`, userId: assignee });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { project, status, priority, assignee } = req.query;
        const filter = {};
        if (project) filter.project = project;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignee = assignee;

        const tasks = await Task.find(filter)
            .populate('assignee', 'name email avatar')
            .populate('creator', 'name email')
            .populate('project', 'name')
            .sort({ dueDate: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const updates = req.body;
        const oldValues = {};

        Object.keys(updates).forEach(key => {
            if (task[key] !== updates[key]) {
                oldValues[key] = task[key];
                task[key] = updates[key];
            }
        });

        await task.save();

        if (Object.keys(oldValues).length > 0) {
            await logActivity(task._id, req.user._id, 'updated', { oldValue: oldValues, newValue: updates });
        }

        const io = getIO();
        if (task.project) {
            io.to(task.project.toString()).emit('task_updated', task);
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();

        const io = getIO();
        if (task.project) {
            io.to(task.project.toString()).emit('task_deleted', req.params.id);
        }

        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const logs = await ActivityLog.find({ task: req.params.id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
