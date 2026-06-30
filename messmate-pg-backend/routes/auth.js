const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

// Mongoose example:
// const User = require('../models/User');

// Sequelize example:
//const { User } = require('../models/User');
const User = require('../models/User');


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required.' });

  try {
    const existingUser = await User.findOne({ where: { username } }); // Sequelize
    // const existingUser = await User.findOne({ username }); // Mongoose

    if (existingUser)
      return res.status(409).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, password: hashedPassword }); // Sequelize
    // const newUser = new User({ username, password: hashedPassword }); await newUser.save(); // Mongoose

    return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});



router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } }); // Sequelize
    // const user = await User.findOne({ username }); // Mongoose

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed due to server error.' });
  }
});

// router.get("/profile", (req, res) => {
//   console.log("PROFILE ROUTE HIT");
//   res.json({ message: "profile working" });
// });

// const express = require("express");
//const router = express.Router();

//const authMiddleware = require("../middleware/authMiddleware");
//const User = require("../models/User");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // 🔥 DEBUG (optional but helpful)
    console.log("User ID from token:", req.userId);

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No userId in token" });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
module.exports=router;