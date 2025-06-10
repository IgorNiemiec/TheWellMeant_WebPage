// backend/routes/blog.js

const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); // Upewnij się, że ścieżka do modelu jest poprawna
const auth = require('../middleware/auth'); // Middleware do autoryzacji

// @route   GET /api/blogs/public
// @desc    Get all blogs (public access)
// @access  Public
router.get('/public', async (req, res) => {
    try {
        // Find all blogs and populate author's username
        // .select('-chapters.content') - Opcjonalnie: nie wysyłaj całej treści rozdziałów
        // jeśli chcesz tylko podgląd na liście, aby zmniejszyć rozmiar danych.
        const blogs = await Blog.find({})
                                .populate('author', 'username') // Pobierz username autora
                                .select('-__v -updatedAt'); // Wyklucz te pola z wyniku

        // Możesz przetworzyć blogi, aby dodać pole authorName
        const blogsWithAuthorName = blogs.map(blog => ({
            ...blog.toObject(), // Konwertuj Mongoose Document na plain JS Object
            authorName: blog.author ? blog.author.username : 'Nieznany Autor', // Dodaj nazwę autora
            // contentExcerpt: blog.chapters[0] ? blog.chapters[0].content.substring(0, 150) + '...' : '' // Opcjonalny skrót
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
        // Find blogs for the authenticated user
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
    const { title, chapters, mainImageUrl } = req.body; // mainImageUrl jest już w body
    try {
        const newBlog = new Blog({
            title,
            chapters,
            mainImageUrl, // Zapisz URL obrazka
            author: req.user.id
        });

        const blog = await newBlog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error(err.message);
        // Obsługa błędu unikalności tytułu
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

        // Upewnij się, że tylko autor może edytować swój blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Brak autoryzacji do edycji tego bloga.' });
        }

        blog.title = title;
        blog.chapters = chapters;
        blog.mainImageUrl = mainImageUrl; // Zaktualizuj URL obrazka
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

        // Upewnij się, że tylko autor może usunąć swój blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Brak autoryzacji do usunięcia tego bloga.' });
        }

        await blog.deleteOne(); // Użyj deleteOne() lub remove()
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