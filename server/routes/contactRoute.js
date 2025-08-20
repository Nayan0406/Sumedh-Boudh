import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Add Contact
router.post('/', async (req, res) => {
	try {
		const { name, number, email, message } = req.body;
		
		if (!name || !number || !email || !message) {
			return res.status(400).json({ error: 'All fields are required.' });
		}

		const newContact = new Contact({ name, number, email, message });
		await newContact.save();
		res.status(201).json({ message: 'Contact form submitted successfully!' });
	} catch (err) {
		console.error('Contact creation error:', err);
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

// Get all contacts (for admin panel)
router.get('/', async (req, res) => {
	try {
		const contacts = await Contact.find().sort({ createdAt: -1 });
		res.status(200).json(contacts);
	} catch (err) {
		console.error('Error fetching contacts:', err);
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

export default router;
