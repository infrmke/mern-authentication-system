import UserService from '../modules/user/user.service.js'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Restringe o acesso apenas a usuários que realizaram a verificação de conta.
 */
const isAccountVerified = async (req, res, next) => {
  const { id } = req.user

  try {
    const capsule = await UserService.findUserById(id)

    if (!capsule) {
      throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')
    }

    if (!capsule.user.isAccountVerified) {
      throwHttpError(
        403,
        'Account must be verified to perform this action.',
        'USER_NOT_VERIFIED'
      )
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default isAccountVerified
