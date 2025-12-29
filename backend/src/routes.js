import { Router } from 'express'
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js'

import UserRouter from './modules/user/user.route.js'
import AuthRouter from './modules/auth/auth.route.js'
import OtpRouter from './modules/otp/otp.route.js'

const router = Router()

router.use(globalLimiter)

router.use('/users', UserRouter)
router.use('/auth', authLimiter, AuthRouter)
router.use('/otps', authLimiter, OtpRouter)

export default router
