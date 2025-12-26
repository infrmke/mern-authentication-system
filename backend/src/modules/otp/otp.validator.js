import { body, validationResult } from 'express-validator'
import throwHttpError from '../../utils/throwHttpError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg // apenas a primeira mensagem de erro
    throwHttpError(400, firstError, 'VALIDATION_ERROR')
  }

  next()
}

const emailValidator = [
  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail(),

  validate,
]

const otpValidator = [
  body('otp').notEmpty().withMessage('OTP cannot be empty.'),

  validate,
]

const resetValidator = [
  body('new_password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match each other.')
      }
      return true
    }),

  validate,
]

export { emailValidator, otpValidator, resetValidator }
