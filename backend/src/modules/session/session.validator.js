import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const loginValidator = [
  body('email')
    .trim()
    .normalizeEmail() // retira pontos extras e converte a string para minúscula
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Provide a valid e-mail address.'),

  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),

  handleValidation,
]

export default loginValidator
