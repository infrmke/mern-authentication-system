import { Router } from 'express'

import sessionController from './session.controller.js'
import loginValidator from './session.validator.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route POST /sessions/login
router.post('/login', loginValidator, sessionController.authenticate)

// @route POST /sessions/logout
router.post('/logout', sessionController.terminate)

//  --- PRIVATE ROUTES ---

// @route GET /sessions/me
router.get('/me', verifyAccessToken, sessionController.show)

export default router
