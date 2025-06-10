const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // KLUCZOWA ZMIANA: Zapewnia, że user może mieć tylko jeden preorder
  },
  edition: { // Zamiast gameTitle
    type: String,
    required: true,
    enum: ['Standard Edition', 'Deluxe Edition'], // Opcje edycji
    trim: true
  },
  paymentMethod: { // Nowe pole: forma płatności
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'], // Przykładowe formy płatności
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Preorder', preorderSchema);