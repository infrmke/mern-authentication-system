import { Router } from 'express'

const router = Router()

import UserRouter from './modules/user/user.route.js'
import AuthRouter from './modules/auth/auth.route.js'
import OtpRouter from './modules/otp/otp.route.js'

router.use('/users', UserRouter)
router.use('/auth', AuthRouter)
router.use('/otp', OtpRouter)

export default router
