import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set storage engine for local file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter for images only
function fileFilter (req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// Add Product with local image upload
router.post('/', upload.single('image'), async (req, res) => {
	try {
		console.log('Product route hit');
		console.log('Request body:', req.body);
		console.log('Request file:', req.file);
		
		const { title, content } = req.body;
		const image = req.file ? `/uploads/${req.file.filename}` : null;
		
		console.log('Parsed data:', { title, content, image });
		
		if (!title || !content || !image) {
			console.log('Missing fields');
			return res.status(400).json({ error: 'All fields are required.' });
		}

		const newProduct = new Product({ title, content, image });
		console.log('Creating product:', newProduct);
		
		await newProduct.save();
		console.log('Product saved successfully');
		
		res.status(201).json({ message: 'Product added successfully!' });
	} catch (err) {
		console.error('Product creation error:', err);
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

// Get all products
router.get('/', async (req, res) => {
	try {
		const products = await Product.find().sort({ createdAt: -1 });
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}
		res.json(product);
	} catch (err) {
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
	try {
		const { title, content } = req.body;
		let updateData = { title, content };
		if (req.file) {
			updateData.image = `/uploads/${req.file.filename}`;
		}
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);
		if (!updatedProduct) {
			return res.status(404).json({ error: 'Product not found' });
		}
		res.json({ message: 'Product updated successfully!', product: updatedProduct });
	} catch (err) {
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

// Delete a product
router.delete('/:id', async (req, res) => {
	try {
		const deleted = await Product.findByIdAndDelete(req.params.id);
		if (!deleted) {
			return res.status(404).json({ error: 'Product not found' });
		}
		res.json({ message: 'Product deleted successfully!' });
	} catch (err) {
		res.status(500).json({ error: 'Server error: ' + err.message });
	}
});

export default router;
