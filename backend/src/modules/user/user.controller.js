import UserService from './user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.findAllUsers()

    if (!users) {
      return res.status(200).json({ message: 'There are no registered users.' })
    }

    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  const { id } = req.user

  try {
    const capsule = await UserService.findUserById(id)

    if (!capsule) {
      throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')
    }

    const { formattedUser } = capsule

    return res.status(200).json(formattedUser)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body

  if (!name || !email || !password || !confirm_password) {
    throwHttpError(
      400,
      'Must provide fields "name", "email", "password" and "confirm_password" for registration.',
      'USER_MISSING_FIELDS'
    )
  }

  if (password.length < 8) {
    throwHttpError(
      400,
      'Password must be at least 8 characters.',
      'PASSWORD_TOO_SHORT'
    )
  }

  if (password !== confirm_password) {
    throwHttpError(
      400,
      'Password must be at least 8 characters.',
      'PASSWORD_NOT_EQUAL'
    )
  }

  const data = { name, email, password }

  try {
    const { formattedUser, accessToken } = await UserService.createUser(data)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    return res.status(201).json(formattedUser)
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]

      error.code = 409
      error.message = `This ${field} already exists in the database.`
      error.code = 'USER_ALREADY_EXISTS'
    }

    next(error)
  }
}

export default { getAllUsers, getUser, createUser }
