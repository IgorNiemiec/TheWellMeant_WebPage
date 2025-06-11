const validateRequest = require('../middleware/validateRequest');
const { body, param } = require('express-validator');

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
     

router.post(
  '/',
  auth,
  [
    body('edition').notEmpty().withMessage('Edycja jest wymagana')
                   .isIn(['Standard Edition', 'Deluxe Edition']).withMessage('Nieprawidłowa edycja'),
    body('paymentMethod').notEmpty().withMessage('Forma płatności jest wymagana')
                         .isIn(['Credit Card', 'PayPal', 'Bank Transfer']).withMessage('Nieprawidłowa forma płatności')
   
  ],
  validateRequest,
  createPreorder
);

router.get('/', auth, getAllPreorders); 
router.get('/:id', auth, getPreorderById); 

router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Nieprawidłowe ID preorderu'),
    body('edition').optional() 
                   .isIn(['Standard Edition', 'Deluxe Edition']).withMessage('Nieprawidłowa edycja'),
    body('paymentMethod').optional() 
                         .isIn(['Credit Card', 'PayPal', 'Bank Transfer']).withMessage('Nieprawidłowa forma płatności'),
    body('status').optional().isIn(['pending','confirmed','cancelled']).withMessage('Nieprawidłowy status')
    
  ],
  validateRequest, 
  updatePreorder
);

router.delete('/:id', auth, deletePreorder); 

module.exports = router;