import { Router } from 'express'

import otpController from './otp.controller.js'
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
router.post('/email-verification/:id', validateId, otpController.requestVerification)

// @route POST /otps/email-verification/check/:id
router.post('/email-verification/check/:id', validateId, otpValidator, otpController.verifyEmail)

// @route POST /otps/password-reset/request
router.post('/password-reset/request', emailValidator, otpController.requestReset)

// @route POST /otps/password-reset/check
router.post('/password-reset/check/', emailValidator, otpValidator, otpController.verifyReset)

//  --- PRIVATE ROUTES ---

// @route GET /otps/password-reset/status
router.get('/password-reset/status', verifyPasswordToken, otpController.show)

// @route PATCH /password-reset
router.patch(
  '/password-reset',
  verifyPasswordToken,
  emailValidator,
  resetValidator,
  otpController.resetPassword,
)

// @route POST /otps/resend
router.post('/resend', resendOtpFlow, resendOtpValidator, otpController.resendCode)

export default router
