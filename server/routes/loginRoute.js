import express from 'express';
import Auth from '../models/Auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET route for login page
router.get('/', (req, res) => {
  res.json({ message: 'Login endpoint - use POST to authenticate' });
});

// Change from '/login' to just '/'
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;