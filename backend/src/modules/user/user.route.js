import { Router } from 'express'

import UserController from './user.controller.js'
import validateIdFormat from '../../middlewares/validateIdFormat.js'
import validateIdExists from '../../middlewares/validateIdExists.js'

const router = Router()

const validateId = [validateIdFormat, validateIdExists]

router.get('/', UserController.getAllUsers)
router.get('/:id', validateId, UserController.getUser)
router.post('/create', UserController.createUser)

export default router
