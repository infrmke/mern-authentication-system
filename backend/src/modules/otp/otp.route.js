import { Router } from 'express'

import OtpController from './otp.controller.js'

import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]

router.post('/email/:id', validateId, OtpController.sendEmailVerification)
router.post('/email/verify/:id', validateId, OtpController.verifyUserEmail)

router.post('/reset', OtpController.sendPasswordReset)
router.post('/reset/verify/', OtpController.resetUserPassword)

export default router
