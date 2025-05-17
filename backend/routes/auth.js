const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const validate = require('../middleware/validateRequest');

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  validate,
  login
);

module.exports = router;
