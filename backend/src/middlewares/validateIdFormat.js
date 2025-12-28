import mongoose from 'mongoose'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Verifica se o ID fornecido segue o padrão de ID auto-gerado pelo MongoDB.
 */
const validateIdFormat = async (req, res, next) => {
  const { id } = req.params

  const isIdValid = mongoose.Types.ObjectId.isValid(id)

  if (!isIdValid) {
    throwHttpError(
      400,
      'The provided ID format is invalid.',
      'INVALID_ID_FORMAT'
    )
  }

  next()
}

export default validateIdFormat
