import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage (temporary)
const storage = multer.memoryStorage();

// File filter for images only
function fileFilter (req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// Add Product with Cloudinary image upload
router.post('/', upload.single('image'), async (req, res) => {
	try {
		console.log('Product route hit');
		console.log('Request body:', req.body);
		console.log('Request file:', req.file);
		
		const { title, content } = req.body;
		
		if (!title || !content || !req.file) {
			console.log('Missing fields');
			return res.status(400).json({ error: 'All fields are required.' });
		}

		// Upload image to Cloudinary
		const uploadResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{
					folder: 'products', // Optional: organize images in folders
					resource_type: 'image'
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			).end(req.file.buffer);
		});

		console.log('Cloudinary upload response:', uploadResponse);
		
		const imageUrl = uploadResponse.secure_url;
		
		const newProduct = new Product({ title, content, image: imageUrl });
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
			// Upload new image to Cloudinary
			const uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader.upload_stream(
					{
						folder: 'products',
						resource_type: 'image'
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					}
				).end(req.file.buffer);
			});
			
			updateData.image = uploadResponse.secure_url;
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
