const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); 
const auth = require('../middleware/auth'); 

// @route   GET /api/blogs/public
// @desc    Get all blogs (public access)
// @access  Public
router.get('/public', async (req, res) => {
    try {
      
        const blogs = await Blog.find({})
                                .populate('author', 'username') 
                                .select('-__v -updatedAt');

        const blogsWithAuthorName = blogs.map(blog => ({
            ...blog.toObject(), 
            authorName: blog.author ? blog.author.username : 'Nieznany Autor', // Dodaj nazwę autora
            
        }));

        res.json(blogsWithAuthorName);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username');

        if (!blog) {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }

        const blogWithAuthorName = {
            ...blog.toObject(),
            authorName: blog.author ? blog.author.username : 'Nieznany Autor'
        };

        res.json(blogWithAuthorName);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/blogs (dla zalogowanego użytkownika - zarządzanie)
// @desc    Get blogs for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
       
        const blogs = await Blog.find({ author: req.user.id })
                                .populate('author', 'username')
                                .select('-__v -updatedAt');

        const blogsWithAuthorName = blogs.map(blog => ({
            ...blog.toObject(),
            authorName: blog.author ? blog.author.username : 'Nieznany Autor'
        }));

        res.json(blogsWithAuthorName);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/blogs
// @desc    Add new blog
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, chapters, mainImageUrl } = req.body; 
    try {
        const newBlog = new Blog({
            title,
            chapters,
            mainImageUrl,
            author: req.user.id
        });

        const blog = await newBlog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error(err.message);
        
        if (err.code === 11000 && err.keyPattern && err.keyPattern.title) {
            return res.status(400).json({ message: 'Tytuł bloga musi być unikalny.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, chapters, mainImageUrl } = req.body;
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }

      
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Brak autoryzacji do edycji tego bloga.' });
        }

        blog.title = title;
        blog.chapters = chapters;
        blog.mainImageUrl = mainImageUrl; 
        blog.updatedAt = Date.now();

        await blog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }

      
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Brak autoryzacji do usunięcia tego bloga.' });
        }

        await blog.deleteOne(); 
        res.json({ message: 'Blog został pomyślnie usunięty.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog nie znaleziony' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;