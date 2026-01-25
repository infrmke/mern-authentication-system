import { Router } from 'express'

import userController from './user.controller.js'
import { registerValidator, updateValidator } from './user.validator.js'
import validateId from '../../middlewares/validateId.js'
import { fullLock, ownerOnly } from '../../middlewares/tollPlaza.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route GET /users
router.get('/', userController.getAll)

// @route POST /users
router.post('/', registerValidator, userController.create)

// @route GET /users/:id
router.get('/:id', validateId, userController.getById)

//  --- PRIVATE ROUTES ---

// @route PATCH /users/:id
router.patch('/:id', ownerOnly, updateValidator, userController.update)

// @route DELETE /users/:id
router.delete('/:id', fullLock, userController.destroy)

export default router
