import { body, validationResult, param } from 'express-validator'
import throwHttpError from '../../utils/throwHttpError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg // apenas a primeira mensagem de erro
    throwHttpError(400, firstError, 'VALIDATION_ERROR')
  }

  next()
}

const registerValidator = [
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
    .withMessage('Provide a valid email address.'),

  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match each other.')
      }
      return true
    }),

  validate,
]

const deleteUserValidator = [
  param('id').custom((value, { req }) => {
    //  "value" é o id passado por param, e req.user.id é o id dentro do token
    if (!req.user || value !== req.user.id.toString()) {
      throw new Error('You are not authorized to delete this account.')
    }

    return true
  }),

  validate,
]

export { registerValidator, deleteUserValidator }
