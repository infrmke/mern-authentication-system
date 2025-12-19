import User from '../modules/user/user.model.js'

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

    req.user = { id: isIdOnDb._id }

    next()
  } catch (error) {
    next(error)
  }
}

export default validateIdExists
