const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
    }],
    status: { type: String, enum: ['active', 'archived', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
