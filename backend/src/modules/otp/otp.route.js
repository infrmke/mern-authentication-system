import { Router } from 'express'

import OtpController from './otp.controller.js'
import {
  otpValidator,
  emailValidator,
  resendOtpValidator,
  resetValidator,
} from './otp.validator.js'

import validateId from '../../middlewares/validateId.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import verifyPasswordToken from '../../middlewares/verifyPasswordToken.js'

const router = Router()

const validateIdAndOtp = [validateId, otpValidator]
const validatePasswordReset = [
  verifyPasswordToken,
  emailValidator,
  resetValidator,
]

const emailAndOtpValidator = [emailValidator, otpValidator]

//  --- PUBLIC ROUTES ---

// @route POST /otps/email-verification/:id
router.post(
  '/email-verification/:id',
  validateId,
  OtpController.sendVerification
)

// @route POST /otps/email-verification/check/:id
router.post(
  '/email-verification/check/:id',
  validateIdAndOtp,
  OtpController.verifyEmail
)

// @route POST /otps/password-reset/request
router.post(
  '/password-reset/request',
  emailValidator,
  OtpController.requestReset
)

// @route POST /otps/password-reset/check
router.post(
  '/password-reset/check/',
  emailAndOtpValidator,
  OtpController.verifyResetCode
)

//  --- PRIVATE ROUTES ---

// @route GET /otps/password-reset/status
router.get('/password-reset/status', verifyPasswordToken, OtpController.status)

// @route PATCH /password-reset
router.patch(
  '/password-reset',
  validatePasswordReset,
  OtpController.resetPassword
)

// @route POST /otps/resend
// se for do tipo VERIFY, precisa de token. Se for RESET o validator verifica o e-mail
router.post(
  '/resend',
  (req, res, next) => {
    if (req.body.type === 'VERIFY') return verifyAccessToken(req, res, next)
    next()
  },
  resendOtpValidator,
  OtpController.resendCode
)

export default router
