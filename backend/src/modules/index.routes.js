import { Router } from 'express'
import { globalLimiter, sessionLimiter } from '../middlewares/rateLimiter.js'

import UserRouter from './user/user.route.js'
import SessionRouter from './session/session.route.js'
import OtpRouter from './otp/otp.route.js'

const router = Router()

router.use(globalLimiter)

router.use('/users', UserRouter)
router.use('/sessions', sessionLimiter, SessionRouter)
router.use('/otps', sessionLimiter, OtpRouter)

export default router
