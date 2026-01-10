import throwHttpError from '../utils/throwHttpError.js'

/**
 * Restringe o acesso apenas a usuários que realizaram a verificação de conta.
 */
const isAccountVerified = (req, res, next) => {
  if (!req.user.isAccountVerified) {
    throwHttpError(
      403,
      'Account must be verified to perform this action.',
      'USER_NOT_VERIFIED'
    )
  }
  next()
}

export default isAccountVerified
