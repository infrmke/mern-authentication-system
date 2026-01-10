import { validationResult } from 'express-validator'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Processa os resultados das validações do express-validator.
 * Caso existam erros, interrompe a requisição e lança um erro formatado.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg // apenas a primeira mensagem de erro
    throwHttpError(400, firstError, 'VALIDATION_ERROR')
  }

  next()
}

export default handleValidation
