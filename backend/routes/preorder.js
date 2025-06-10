const validateRequest = require('../middleware/validateRequest');
const { body, param } = require('express-validator');

// Zmieniamy nazwę z validate na validateRequest, bo już tak masz w importach
const validate = require('../middleware/validateRequest'); 

const router = require('express').Router();
const {
  createPreorder,
  getAllPreorders,
  getPreorderById,
  updatePreorder,
  deletePreorder
} = require('../controllers/preorderController');
const auth = require('../middleware/auth');

// Wszystkie ścieżki chronione – tylko zalogowani użytkownicy       

router.post(
  '/',
  auth,
  [
    // Zmieniamy walidację z gameTitle na edition i dodajemy paymentMethod
    body('edition').notEmpty().withMessage('Edycja jest wymagana')
                   .isIn(['Standard Edition', 'Deluxe Edition']).withMessage('Nieprawidłowa edycja'),
    body('paymentMethod').notEmpty().withMessage('Forma płatności jest wymagana')
                         .isIn(['Credit Card', 'PayPal', 'Bank Transfer']).withMessage('Nieprawidłowa forma płatności')
    // quantity usunięte
  ],
  validateRequest,
  createPreorder
);

router.get('/', auth, getAllPreorders); 
router.get('/:id', auth, getPreorderById); 

// POPRAWKA: Usunąłem zduplikowaną definicję router.put('/:id')
// Pozostała tylko ta z pełną walidacją.
router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Nieprawidłowe ID preorderu'),
    body('edition').optional() // Edycja jest opcjonalna przy aktualizacji
                   .isIn(['Standard Edition', 'Deluxe Edition']).withMessage('Nieprawidłowa edycja'),
    body('paymentMethod').optional() // Forma płatności jest opcjonalna przy aktualizacji
                         .isIn(['Credit Card', 'PayPal', 'Bank Transfer']).withMessage('Nieprawidłowa forma płatności'),
    body('status').optional().isIn(['pending','confirmed','cancelled']).withMessage('Nieprawidłowy status')
    // quantity usunięte
  ],
  validateRequest, // Używamy validateRequest, tak jak w pozostałych miejscach
  updatePreorder
);

router.delete('/:id', auth, deletePreorder); 

module.exports = router;