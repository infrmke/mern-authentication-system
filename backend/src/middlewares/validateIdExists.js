import User from '../modules/user/user.model.js'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Verifica se o ID fornecido existe ou não no banco de dados. Caso exista, armazena o dado no corpo da requisição.
 */
const validateIdExists = async (req, res, next) => {
  const { id } = req.params

  try {
    const isIdOnDb = await User.findById(id)

    if (!isIdOnDb) {
      throwHttpError(404, 'The requested ID does not exist in our records.', 'USER_NOT_FOUND')
    }

    req.user = { id: isIdOnDb._id }
    next()
  } catch (error) {
    next(error)
  }
}

export default validateIdExists
