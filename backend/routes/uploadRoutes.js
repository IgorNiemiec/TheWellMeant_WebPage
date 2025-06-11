// backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth'); 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/blog_images'; 
      
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
     
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Nieprawidłowy typ pliku. Dozwolone są tylko pliki graficzne.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: fileFilter
});


router.post('/upload-blog-image', auth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nie wybrano pliku do uploadu lub plik jest nieprawidłowy.' });
    }

   
    const imageUrl = `/uploads/blog_images/${req.file.filename}`;
    res.status(200).json({
        message: 'Obrazek został pomyślnie załadowany!',
        imageUrl: imageUrl
    });
});

module.exports = router;