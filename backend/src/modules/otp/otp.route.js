import { Router } from 'express'

import OtpController from './otp.controller.js'
import {
  otpValidator,
  emailValidator,
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

router.post('/email/:id', validateId, OtpController.sendEmailVerification)
router.post(
  '/email/verify/:id',
  validateIdAndOtp,
  OtpController.verifyUserEmail
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
