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
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
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

router.post(
  '/email-verification/:id',
  validateId,
  OtpController.sendEmailVerification
)
router.post(
  '/email-verification/check/:id',
  validateIdAndOtp,
  OtpController.verifyUserEmail
)

router.get('/password-reset/status', verifyPasswordToken, OtpController.status)
router.post(
  '/password-reset/request',
  emailValidator,
  OtpController.requestPasswordReset
)
router.post(
  '/password-reset/check/',
  emailAndOtpValidator,
  OtpController.verifyPasswordOtp
)
router.patch(
  '/password-reset',
  validatePasswordReset,
  OtpController.resetUserPassword
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

export default router
