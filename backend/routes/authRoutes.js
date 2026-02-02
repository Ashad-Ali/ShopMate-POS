const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // --- Demo Access Bypass  ---
    if (username === "admin" && password === "admin123") {
        const token = jwt.sign(
            { id: 'demo_admin_007' }, // Fake ID for demo
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        return res.json({ 
            token, 
            username: "admin", 
            isDemo: true // Optional: frontend ko batane ke liye
        });
    }
    // ------------------------------------------

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "User not Found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Wrong Password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, username: user.username });
    } catch (err) { 
        res.status(500).send("Server Error"); 
    }
});

module.exports = router;