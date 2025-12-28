import { Router } from 'express'

import UserController from './user.controller.js'
import { registerValidator, deleteUserValidator } from './user.validator.js'

import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import isAccountVerified from '../../middlewares/isAccountVerified.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]
const validateTokenAndAccount = [
  verifyAccessToken,
  isAccountVerified,
  ...validateId,
  deleteUserValidator,
]

router.get('/', UserController.getAllUsers)
router.get('/:id', validateId, UserController.getUser)
router.post('/create', registerValidator, UserController.createUser)
router.delete('/:id', validateTokenAndAccount, UserController.deleteUser)

export default router
