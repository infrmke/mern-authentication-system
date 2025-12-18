import mongoose from 'mongoose'

/**
 * Verifica se o ID fornecido segue o padrão de ID auto-gerado pelo MongoDB.
 */
const validateIdFormat = async (req, res, next) => {
  const { id } = req.params

  const isIdValid = mongoose.Types.ObjectId.isValid(id)

  if (!isIdValid) {
    return res.status(400).json({ error: 'Invalid ID format.' })
  }

  next()
}

export default validateIdFormat
