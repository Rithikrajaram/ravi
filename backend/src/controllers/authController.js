const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            const accessToken = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const accessToken = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateToken(user._id);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.refreshToken = undefined;
        await user.save();
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
