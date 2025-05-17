const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Rejestracja nowego użytkownika:
 * 1. Walidacja danych (po stronie server.js lub routes/auth.js).
 * 2. Hashowanie hasła.
 * 3. Zapis użytkownika w bazie.
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;                       
    const exists = await User.findOne({ email });                
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashed = await bcrypt.hash(password, 10);              
    const user = await User.create({ email, password: hashed }); 
    return res.status(201).json({ message: 'User created', id: user._id });
  } catch (err) {
    next(err);                                                  
  }
};

/**
 * Logowanie:
 * 1. Pobranie użytkownika po emailu.
 * 2. Porównanie hasła przez bcrypt.compare.
 * 3. Generacja tokena JWT z danymi użytkownika.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;                       
    const user = await User.findOne({ email });                  
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password); 
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id },                                         
      process.env.JWT_SECRET,                                  
      { expiresIn: '1h' }                                       
    );
    return res.json({ token });
  } catch (err) {
    next(err);                                                  
  }
};
