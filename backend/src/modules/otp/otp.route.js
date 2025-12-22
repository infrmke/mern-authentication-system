import { Router } from 'express'

import OtpController from './otp.controller.js'
import {
  otpValidator,
  emailValidator,
  passwordResetValidator,
} from './otp.validator.js'

import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]
const validateIdAndOtp = [...validateId, otpValidator]

router.post('/email/:id', validateId, OtpController.sendEmailVerification)
router.post(
  '/email/verify/:id',
  validateIdAndOtp,
  OtpController.verifyUserEmail
)

router.post('/reset', emailValidator, OtpController.sendPasswordReset)
router.post(
  '/reset/verify/',
  passwordResetValidator,
  OtpController.resetUserPassword
)

export default router
