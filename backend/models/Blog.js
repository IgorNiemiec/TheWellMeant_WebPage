

const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true // Możesz chcieć, aby tytuły blogów były unikalne
    },
    mainImageUrl: { // NOWE POLE DLA GŁÓWNEGO OBRAZKA
        type: String,
        default: '' // Domyślnie puste, jeśli nie ma obrazka
    },
    chapters: [chapterSchema], // Tablica rozdziałów
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);