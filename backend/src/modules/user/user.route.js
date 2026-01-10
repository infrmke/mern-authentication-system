import { Router } from 'express'

import UserController from './user.controller.js'
import registerValidator from './user.validator.js'

import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import isAccountVerified from '../../middlewares/isAccountVerified.js'
import verifyOwnership from '../../middlewares/verifyOwnership.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]
const validateTokenAndAccount = [
  verifyAccessToken,
  isAccountVerified,
  ...validateId,
  verifyOwnership,
]

//  --- PUBLIC ROUTES ---

// @route GET /users
router.get('/', UserController.getAll)

// @route POST /users
router.post('/', registerValidator, UserController.create)

// @route GET /users/:id
router.get('/:id', validateId, UserController.getById)

//  --- PRIVATE ROUTES ---

// @route DELETE /users/:id
router.delete('/:id', validateTokenAndAccount, UserController.destroy)

export default router
