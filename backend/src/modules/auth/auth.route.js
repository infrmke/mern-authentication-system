import { Router } from 'express'

import AuthController from './auth.controller.js'
import loginValidator from './auth.validator.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route POST /auth/login
router.post('/login', loginValidator, AuthController.logIn)

// @route POST /auth/logout
router.post('/logout', AuthController.logOut)

//  --- PRIVATE ROUTES ---

// @route GET /auth/me
router.get('/me', verifyAccessToken, AuthController.status)

export default router
