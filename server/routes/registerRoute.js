import express from 'express';
import Auth from '../models/Auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email , password } = req.body;
  console.log('Received data:', { email, password }); // Debug log
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Auth({ email, password: hashedPassword });
    
    console.log('Attempting to save user:', newUser); // Debug log
    await newUser.save();
    console.log('User saved successfully'); // Debug log
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); // Debug log
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

export default router;