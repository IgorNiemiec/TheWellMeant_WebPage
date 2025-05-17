const { body } = require('express-validator');


const router = require('express').Router();
const {
  createPreorder,
  getAllPreorders,
  getPreorderById,
  updatePreorder,
  deletePreorder
} = require('../controllers/preorderController');
const auth = require('../middleware/auth');

// Wszystkie ścieżki chronione – tylko zalogowani użytkownicy\       

router.post(
  '/',
  auth,
  [
    body('gameTitle').notEmpty().withMessage('Title is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validateRequest,      // custom middleware, zbiera błędy walidacji
  createPreorder        // POST   /api/preorders
);



router.get('/', auth, getAllPreorders);           // GET    /api/preorders
router.get('/:id', auth, getPreorderById);        // GET    /api/preorders/:id


router.put('/:id', auth, updatePreorder);         // PUT    /api/preorders/:id

router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Nieprawidłowe ID'),
    body('status').optional().isIn(['pending','confirmed','cancelled']),
    body('quantity').optional().isInt({ min: 1 }),
  ],
  validate,
  updatePreorder
);

router.delete('/:id', auth, deletePreorder);      // DELETE /api/preorders/:id







module.exports = router;
