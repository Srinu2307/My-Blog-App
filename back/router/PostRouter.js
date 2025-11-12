const express = require('express');
const router = express.Router();
const Post = require('../models/PostModel');

const upload = require('../middleware/upload.js');
const fs = require('fs');
const path = require('path');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;
    // let imageUrl = '';
    // if (req.file) {
    //   imageUrl = `/uploads/${req.file.filename}`;
    // }
    const imageUrl = req.file ? req.file.path : '';
    const post = await Post.create({ title, author, content, imageUrl });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Update Post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete Post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;