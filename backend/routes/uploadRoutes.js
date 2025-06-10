// backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth'); // Zakładam, że masz middleware do autoryzacji

// --- Konfiguracja Multer ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/blog_images'; // Katalog docelowy
        // Upewnij się, że katalog istnieje. Jeśli nie, Multer go stworzy.
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generuj unikalną nazwę pliku, aby uniknąć konfliktów
        // np. timestamp-nazwa_oryginalnego_pliku.rozszerzenie
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    // Akceptuj tylko pliki graficzne
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Nieprawidłowy typ pliku. Dozwolone są tylko pliki graficzne.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit rozmiaru pliku do 5MB
    fileFilter: fileFilter
});

// --- Endpoint do uploadu pojedynczego obrazka ---
// Używamy middleware `auth` do ochrony endpointu, aby tylko zalogowani użytkownicy mogli uploadować.
router.post('/upload-blog-image', auth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nie wybrano pliku do uploadu lub plik jest nieprawidłowy.' });
    }

    // Zwróć URL do zapisanego pliku.
    // Ścieżka `/uploads/blog_images/` będzie dostępna publicznie dzięki `express.static` w `server.js`.
    const imageUrl = `/uploads/blog_images/${req.file.filename}`;
    res.status(200).json({
        message: 'Obrazek został pomyślnie załadowany!',
        imageUrl: imageUrl
    });
});

module.exports = router;