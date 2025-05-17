require('dotenv').config();         // wczytuje zmienne z .env przed resztą kodu :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
const express = require('express'); // ładuje framework HTTP :contentReference[oaicite:2]{index=2}
const cors = require('cors');       // umożliwia Cross‑Origin Resource Sharing :contentReference[oaicite:3]{index=3}
const helmet = require('helmet');   // dodaje zabezpieczenia nagłówków HTTP :contentReference[oaicite:4]{index=4}


const app = express();

// Parsowanie JSON w ciele żądań
app.use(express.json());            // obsługa `application/json` w request body :contentReference[oaicite:6]{index=6}

// Włączenie CORS dla wszystkich źródeł
app.use(cors());                    // zezwala frontendowi na inną domenę/port :contentReference[oaicite:7]{index=7}

// Zwiększenie bezpieczeństwa nagłówków
app.use(helmet());                  // minimalizuje ryzyko ataków typu XSS itp. :contentReference[oaicite:8]{index=8}


const PORT = process.env.PORT || 5001;

const connectDB = require('./config/db');
connectDB();                          // łączy z MongoDB przed podniesieniem tras :contentReference[oaicite:17]{index=17}

// Trasy auth (rejestracja, logowanie)
app.use('/api/auth', require('./routes/auth'));

// **Nowe trasy preorderów**
app.use('/api/preorders', require('./routes/preorder'));


// Globalny middleware obsługi błędów
app.use((err, req, res, next) => {
  console.error(err.stack);                                
  res.status(500).json({ message: 'Server error' });       
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
