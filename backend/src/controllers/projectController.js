const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.create({
            name,
            description,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'owner' }]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            'members.user': req.user._id
        }).populate('owner', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Only owner/admin can add members
        const currentUser = project.members.find(m => m.user.toString() === req.user._id.toString());
        if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        project.members.push({ user: userId, role });
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
