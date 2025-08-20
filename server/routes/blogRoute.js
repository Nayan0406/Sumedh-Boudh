import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});


// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true }
    );
    if (!updatedBlog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog updated successfully!', blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    console.log('Delete request received for ID:', req.params.id);
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    console.log('Deleted blog:', deletedBlog);
    if (!deletedBlog) {
      console.log('Blog not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully!' });
  } catch (err) {
    console.log('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;