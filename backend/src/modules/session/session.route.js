import { Router } from 'express'

import SessionController from './session.controller.js'
import loginValidator from './session.validator.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route POST /sessions/login
router.post('/login', loginValidator, SessionController.authenticate)

// @route POST /sessions/logout
router.post('/logout', SessionController.terminate)

//  --- PRIVATE ROUTES ---

// @route GET /sessions/me
router.get('/me', verifyAccessToken, SessionController.show)

export default router
