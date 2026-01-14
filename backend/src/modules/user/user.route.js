import { Router } from 'express'

import UserController from './user.controller.js'
import { registerValidator, updateValidator } from './user.validator.js'
import validateId from '../../middlewares/validateId.js'
import { fullLock, ownerOnly } from '../../middlewares/tollPlaza.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route GET /users
router.get('/', UserController.getAll)

// @route POST /users
router.post('/', registerValidator, UserController.create)

// @route GET /users/:id
router.get('/:id', validateId, UserController.getById)

//  --- PRIVATE ROUTES ---

// @route PATCH /users/:id
router.patch('/:id', ownerOnly, updateValidator, UserController.update)

// @route DELETE /users/:id
router.delete('/:id', fullLock, UserController.destroy)

export default router
