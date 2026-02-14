require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected for seeding...');

        // Clear existing
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@tasknexus.com',
            password: 'password123',
            role: 'admin'
        });

        // Create Manager
        const manager = await User.create({
            name: 'Project Manager',
            email: 'manager@tasknexus.com',
            password: 'password123',
            role: 'manager'
        });

        // Create User
        const user = await User.create({
            name: 'Developer Joe',
            email: 'joe@tasknexus.com',
            password: 'password123',
            role: 'user'
        });

        // Create Project
        const project = await Project.create({
            name: 'Website Redesign',
            description: 'Overhaul the company website with modern UI',
            owner: manager._id,
            members: [
                { user: manager._id, role: 'owner' },
                { user: user._id, role: 'member' },
                { user: admin._id, role: 'admin' }
            ]
        });

        // Create Tasks
        await Task.create([
            {
                title: 'Design Mockups',
                description: 'Create high-fidelity mockups in Figma',
                priority: 'high',
                status: 'completed',
                dueDate: new Date(),
                assignee: user._id,
                creator: manager._id,
                project: project._id,
                tags: ['design']
            },
            {
                title: 'Setup Vite + React',
                description: 'Initialize the frontend project with Vite',
                priority: 'medium',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 86400000), // Tomorrow
                assignee: user._id,
                creator: manager._id,
                project: project._id,
                tags: ['dev']
            },
            {
                title: 'API Integration',
                description: 'Connect frontend to the new REST API. This is urgent!',
                priority: 'critical',
                status: 'todo',
                dueDate: new Date(Date.now() + 172800000), // In 2 days
                assignee: user._id,
                creator: manager._id,
                project: project._id,
                tags: ['dev'],
                aiSuggestedPriority: 'critical'
            }
        ]);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
