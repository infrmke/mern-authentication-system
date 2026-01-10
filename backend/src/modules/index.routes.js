import { Router } from 'express'
import { globalLimiter, authLimiter } from '../middlewares/rateLimiter.js'

import UserRouter from './user/user.route.js'
import AuthRouter from './auth/auth.route.js'
import OtpRouter from './otp/otp.route.js'

const router = Router()

router.use(globalLimiter)

router.use('/users', UserRouter)
router.use('/auth', authLimiter, AuthRouter)
router.use('/otps', authLimiter, OtpRouter)

export default router
