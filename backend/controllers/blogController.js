// backend/controllers/blogController.js

const Blog = require('../models/Blog');

// @route   POST api/blogs
// @desc    Utwórz nowy wpis na blogu
// @access  Private (tylko zalogowani użytkownicy mogą tworzyć)
exports.createBlog = async (req, res) => {
  try {
    const { title, chapters } = req.body;
    
    // Sprawdź, czy blog o danym tytule już istnieje
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ message: 'Wpis na blogu o takim tytule już istnieje.' });
    }

    const blog = new Blog({
      title,
      author: req.user.id, // ID użytkownika z middleware auth
      chapters
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Błąd serwera podczas tworzenia wpisu na blogu.' });
  }
};

// @route   GET api/blogs
// @desc    Pobierz wszystkie wpisy na blogu
// @access  Public (każdy może je czytać)
exports.getAllBlogs = async (req, res) => {
  try {
    // Populacja pola 'author' pozwoli nam pobrać dane autora (np. username)
    const blogs = await Blog.find().populate('author', 'username').sort('-createdAt'); 
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania wpisów na blogu.' });
  }
};

// @route   GET api/blogs/:id
// @desc    Pobierz pojedynczy wpis na blogu po ID
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ message: 'Wpis na blogu nie znaleziony.' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') { // Jeśli ID jest nieprawidłowe
      return res.status(400).json({ message: 'Nieprawidłowe ID wpisu na blogu.' });
    }
    res.status(500).json({ message: 'Błąd serwera podczas pobierania wpisu na blogu.' });
  }
};

// @route   PUT api/blogs/:id
// @desc    Zaktualizuj wpis na blogu
// @access  Private (tylko autor może edytować)
exports.updateBlog = async (req, res) => {
  const { title, chapters } = req.body;

  // Obiekt do aktualizacji
  const blogFields = {};
  if (title) blogFields.title = title;
  if (chapters) blogFields.chapters = chapters;

  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Wpis na blogu nie znaleziony.' });
    }

    // Sprawdź, czy zalogowany użytkownik jest autorem bloga
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Brak autoryzacji do edycji tego wpisu na blogu.' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: blogFields },
      { new: true, runValidators: true } // Zwraca zaktualizowany dokument i uruchamia walidatory
    );

    res.status(200).json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Nieprawidłowe ID wpisu na blogu.' });
    }
    if (err.code === 11000) { // Błąd duplikatu tytułu
      return res.status(400).json({ message: 'Wpis na blogu o takim tytule już istnieje.' });
    }
    res.status(500).json({ message: 'Błąd serwera podczas aktualizacji wpisu na blogu.' });
  }
};

// @route   DELETE api/blogs/:id
// @desc    Usuń wpis na blogu
// @access  Private (tylko autor może usunąć)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Wpis na blogu nie znaleziony.' });
    }

    // Sprawdź, czy zalogowany użytkownik jest autorem bloga
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Brak autoryzacji do usunięcia tego wpisu na blogu.' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Wpis na blogu został usunięty.' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Nieprawidłowe ID wpisu na blogu.' });
    }
    res.status(500).json({ message: 'Błąd serwera podczas usuwania wpisu na blogu.' });
  }
};