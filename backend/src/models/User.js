const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
    avatar: { type: String, default: '' },
    productivityScore: { type: Number, default: 0 },
    preferences: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true }
    },
    refreshToken: { type: String },
    lastLogin: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
