import { Router } from 'express'

import AuthController from './auth.controller.js'
import loginValidator from './auth.validator.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

router.get('/status', verifyAccessToken, AuthController.status)
router.post('/login', loginValidator, AuthController.logIn)
router.post('/logout', AuthController.logOut)

export default router
