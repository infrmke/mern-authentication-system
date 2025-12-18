import User from '../modules/user/user.model.js'
import formatUserObject from '../utils/formatUserObject.js'

/**
 * Verifica se o ID fornecido existe ou não no banco de dados. Caso exista, armazena o dado no corpo da requisição.
 */
const validateIdExists = async (req, res, next) => {
  const { id } = req.params

  try {
    const isIdOnDb = await User.findById(id)

    if (!isIdOnDb) {
      return res.status(404).json({ error: "ID doesn't exist." })
    }

    const formattedUser = formatUserObject(isIdOnDb)
    req.user = { ...req.user, ...formattedUser }

    next()
  } catch (error) {
    next(error)
  }
}

export default validateIdExists
