import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const emailValidator = [
  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Provide a valid email address.'),

  handleValidation,
]

const otpValidator = [
  body('otp').notEmpty().withMessage('OTP cannot be empty.'),

  handleValidation,
]

const resendOtpValidator = [
  body('type').isIn(['VERIFY', 'RESET']).withMessage('Invalid OTP type.'),

  body('email')
    // a corrente de validação abaixo só vai acontecer se o type de otp for 'RESET'
    .if(body('type').equals('RESET'))
    .trim()
    .isEmail()
    .withMessage('Provide a valid email address.'),

  handleValidation,
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
        throw new Error('Passwords must match each other.')
      }
      return true
    }),

  handleValidation,
]

export { emailValidator, otpValidator, resendOtpValidator, resetValidator }
