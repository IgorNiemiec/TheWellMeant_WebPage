const Preorder = require('../models/Preorder');

// 1. CREATE: Składanie preorderu
exports.createPreorder = async (req, res) => {
  try {
    const { edition, paymentMethod } = req.body; // Zmienione pola
    
    // Walidacja czy użytkownik już ma preorder zostanie obsłużona przez unique: true w modelu,
    // ale możemy też dodać walidację prewencyjną, aby zwrócić ładniejszy komunikat
    const existingPreorder = await Preorder.findOne({ user: req.user.id });
    if (existingPreorder) {
      return res.status(400).json({ message: 'Już złożyłeś/złożyłaś preorder na tę grę.' });
    }

    const preorder = await Preorder.create({
      user: req.user.id,
      edition, // Używamy edition
      paymentMethod // Używamy paymentMethod
      // quantity już niepotrzebne
    });
    return res.status(201).json(preorder);
  } catch (err) {
    // Obsługa błędu duplikatu klucza (jeśli walidacja prewencyjna została pominięta lub dla pewności)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.user) {
      return res.status(400).json({ message: 'Już złożyłeś/złożyłaś preorder na tę grę.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error podczas tworzenia preorderu.' });
  }
};

// 2. READ ALL: aby użytkownik zobaczył wszystkie swoje preordery (zmiana nazwy pola, reszta ok)
exports.getAllPreorders = async (req, res) => {
  try {
    // Nadal pobieramy preordery użytkownika, ale teraz user jest unique
    const preorders = await Preorder.find({ user: req.user.id }).sort('-createdAt');
    // Ponieważ użytkownik może mieć tylko jeden preorder, ta tablica będzie miała max 1 element
    return res.status(200).json(preorders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 3. READ ONE: pobranie szczegółów konkretnego preorderu po ID (bez zmian)
exports.getPreorderById = async (req, res) => {
  try {
    const preorder = await Preorder.findOne({ _id: req.params.id, user: req.user.id });
    if (!preorder) {
      return res.status(404).json({ message: 'Preorder not found' });
    }
    return res.status(200).json(preorder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 4. UPDATE: np. zmiana statusu, edycji lub formy płatności
exports.updatePreorder = async (req, res) => {
  try {
    const { edition, paymentMethod, status } = req.body; // Zmienione/dodane pola
    
    const updates = {};
    if (edition) updates.edition = edition;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (status) updates.status = status;

    const preorder = await Preorder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates }, // Używamy obiektu updates
      { new: true, runValidators: true }
    );
    if (!preorder) {
      return res.status(404).json({ message: 'Preorder not found or not authorized' });
    }
    return res.status(200).json(preorder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error podczas aktualizacji preorderu.' });
  }
};

// 5. DELETE: usuwanie preorderu (bez zmian)
exports.deletePreorder = async (req, res) => {
  try {
    const preorder = await Preorder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!preorder) {
      return res.status(404).json({ message: 'Preorder not found or not authorized' });
    }
    return res.status(200).json({ message: 'Preorder deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};