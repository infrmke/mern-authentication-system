import { Router } from 'express'

import OtpController from './otp.controller.js'
import {
  otpValidator,
  emailValidator,
  resendOtpValidator,
  resetValidator,
} from './otp.validator.js'

import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'
import verifyPasswordToken from '../../middlewares/verifyPasswordToken.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]
const validateIdAndOtp = [...validateId, otpValidator]
const validatePasswordReset = [
  verifyPasswordToken,
  emailValidator,
  resetValidator,
]

const emailAndOtpValidator = [emailValidator, otpValidator]

router.get('/status', verifyPasswordToken, OtpController.status)

router.post('/email/:id', validateId, OtpController.sendEmailVerification)
router.post(
  '/email/verify/:id',
  validateIdAndOtp,
  OtpController.verifyUserEmail
)

// re-envio de OTP: se for VERIFY, precisa de token e se for RESET, o validator verifica o e-mail
router.post(
  '/resend',
  (req, res, next) => {
    if (req.body.type === 'VERIFY') return verifyAccessToken(req, res, next)
    next()
  },
  resendOtpValidator,
  OtpController.resendOtp
)

router.post(
  '/forgot-password',
  emailValidator,
  OtpController.requestPasswordReset
)
router.post(
  '/forgot-password/verify/',
  emailAndOtpValidator,
  OtpController.verifyPasswordOtp
)
router.patch(
  '/forgot-password/reset',
  validatePasswordReset,
  OtpController.resetUserPassword
)

export default router
