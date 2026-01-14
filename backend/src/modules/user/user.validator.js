import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const baseUserRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isLength({ min: 2, max: 56 })
    .withMessage('Name must be between 2 and 56 characters.'),

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
]

const registerValidator = [
  ...baseUserRules,
  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match each other.')
      }
      return true
    }),

  handleValidation,
]

const updateValidator = [
  ...baseUserRules.map((rule) => rule.optional()), // transforma todos os campos em opcionais
  body('confirm_password')
    .if(body('password').exists()) // apenas valida se "password" for enviado
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match each other.')
      }
      return true
    }),

  handleValidation,
]

export { registerValidator, updateValidator }
