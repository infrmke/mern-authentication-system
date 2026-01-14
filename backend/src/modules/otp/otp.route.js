import { Router } from 'express'

import OtpController from './otp.controller.js'
import {
  otpValidator,
  emailValidator,
  resendOtpValidator,
  resetValidator,
} from './otp.validator.js'
import validateId from '../../middlewares/validateId.js'
import verifyPasswordToken from '../../middlewares/verifyPasswordToken.js'
import { resendOtpFlow } from '../../middlewares/tollPlaza.js'

const router = Router()

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
  validateId,
  otpValidator,
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
  emailValidator,
  otpValidator,
  OtpController.verifyResetCode
)

//  --- PRIVATE ROUTES ---

// @route GET /otps/password-reset/status
router.get('/password-reset/status', verifyPasswordToken, OtpController.status)

// @route PATCH /password-reset
router.patch(
  '/password-reset',
  verifyPasswordToken,
  emailValidator,
  resetValidator,
  OtpController.resetPassword
)

// @route POST /otps/resend
router.post(
  '/resend',
  resendOtpFlow,
  resendOtpValidator,
  OtpController.resendCode
)

export default router
