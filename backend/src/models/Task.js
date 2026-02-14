const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['backlog', 'todo', 'in-progress', 'review', 'completed'],
        default: 'todo'
    },
    dueDate: { type: Date },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    attachments: [{
        name: String,
        url: String,
        fileType: String
    }],
    tags: [String],
    pomodoroTime: { type: Number, default: 0 }, // minutes
    isRecurring: { type: Boolean, default: false },
    recurrenceRule: { type: String }, // e.g., 'weekly', 'monthly'
    aiSuggestedPriority: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
