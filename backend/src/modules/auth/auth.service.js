import UserService from '../user/user.service.js'

import throwHttpError from '../../utils/throwHttpError.js'
import generateToken from '../../utils/generateToken.js'
import { validatePassword } from '../../utils/password.js'
import formatUserObject from '../../utils/formatUserObject.js'

const logUserIn = async (password, filter) => {
  const capsule = await UserService.findUser(filter, '+password')

  if (!capsule) return null

  const { user } = capsule

  const isPwdValid = await validatePassword(password, user.password)

  if (!isPwdValid)
    throwHttpError(400, 'Incorrect credentials.', 'USER_INVALID_CREDENTIALS')

  const formattedUser = formatUserObject(user)

  const accessToken = generateToken(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    '1d'
  )

  return { formattedUser, accessToken }
}

export default { logUserIn }
