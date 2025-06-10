// backend/server.js

// Załaduj zmienne środowiskowe z pliku .env
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Do obsługi zapytań z innych domen
const helmet = require('helmet'); // Do zwiększania bezpieczeństwa nagłówków HTTP
const path = require('path'); // Do pracy ze ścieżkami plików i katalogów
const mongoose = require('mongoose'); // Do połączenia z bazą danych MongoDB

const app = express(); // Inicjalizacja aplikacji Express

const connectDB = require('./config/db');
connectDB();

// --- Konfiguracja Middleware ---

// CORS Middleware: Powinien być pierwszy, aby nagłówki CORS były ustawiane przed innymi.
// Pozwala na zapytania z dowolnej domeny. W środowisku produkcyjnym powinieneś ograniczyć `origin`.
app.use(cors());

// Helmet Middleware: Dodaje różne nagłówki HTTP dla zwiększenia bezpieczeństwa.
// Konfiguracja `crossOriginResourcePolicy` jest kluczowa dla problemu `NotSameOrigin`.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Pozwala na ładowanie zasobów z różnych domen
}));

// Body Parser Middleware: Wbudowany w Express, parsuje JSON z body żądania.
// Musi być przed definicją tras, które korzystają z req.body.
app.use(express.json());


// --- Serwowanie plików statycznych ---
// Umożliwia dostęp do plików w katalogu `uploads` poprzez URL `/uploads`.
// Np. obrazek zapisany w `backend/uploads/blog_images/image.png` będzie dostępny pod URL `http://localhost:5001/uploads/blog_images/image.png`.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Importuj i użyj routery API ---
// Pamiętaj, aby ścieżki importu były poprawne względem pliku server.js
const authRoutes = require('./routes/auth');
const preorderRoutes = require('./routes/preorder');
const blogRoutes = require('./routes/blog');
const uploadRoutes = require('./routes/uploadRoutes'); // Zakładam, że ten router istnieje

app.use('/api/auth', authRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/blogs', blogRoutes);
// Router dla uploadu plików. Zazwyczaj jest on dostępny pod `/api/upload` lub podobnym.
// Zostawiam `/api` jak w Twoim przykładzie, ale upewnij się, że w `uploadRoutes.js`
// masz odpowiednie endpointy (np. router.post('/upload-blog-image', ...)).
app.use('/api', uploadRoutes);


// --- Globalny middleware obsługi błędów ---
// Ten middleware wyłapuje błędy, które wystąpiły w innych middleware'ach lub trasach.
app.use((err, req, res, next) => {
    console.error(err.stack); // Loguj cały stack błędu dla debugowania
    res.status(500).json({ message: 'Server error' }); // Wysyłaj ogólną wiadomość o błędzie dla klienta
});


// --- Uruchomienie serwera ---
const PORT = process.env.PORT || 5001; // Port, na którym będzie działał serwer (z .env lub domyślny 5001)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});