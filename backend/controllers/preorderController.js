const Preorder = require('../models/Preorder');

// 1. CREATE: najpierw musimy umieć złożyć preorder
exports.createPreorder = async (req, res) => {
  try {
    const { gameTitle, quantity } = req.body;
    // wiemy, które konto (req.user.id) składa zamówienie dzięki middleware auth
    const preorder = await Preorder.create({
      user: req.user.id,
      gameTitle,
      quantity
    });
    return res.status(201).json(preorder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 2. READ ALL: aby użytkownik zobaczył wszystkie swoje preordery
exports.getAllPreorders = async (req, res) => {
  try {
    const preorders = await Preorder.find({ user: req.user.id }).sort('-createdAt');
    return res.status(200).json(preorders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 3. READ ONE: pobranie szczegółów konkretnego preorderu po ID
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

// 4. UPDATE: np. zmiana statusu (pending → confirmed/cancelled)
exports.updatePreorder = async (req, res) => {
  try {
    const { status, quantity } = req.body;
    const preorder = await Preorder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { status, quantity } },
      { new: true, runValidators: true }
    );
    if (!preorder) {
      return res.status(404).json({ message: 'Preorder not found or not authorized' });
    }
    return res.status(200).json(preorder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 5. DELETE: usuwanie preorderu
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
