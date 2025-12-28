import throwHttpError from '../utils/throwHttpError.js'

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
