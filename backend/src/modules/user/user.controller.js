import UserService from './user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

const getAll = async (req, res, next) => {
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

const getById = async (req, res, next) => {
  const { id } = req.params

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

const create = async (req, res, next) => {
  const { name, email, password } = req.body

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
      error.message = `This ${field} is already in use.`
      error.code = 'USER_ALREADY_EXISTS'
    }

    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params

  try {
    const { name, email, password } = req.body
    const updates = { name, email, password }

    const user = await UserService.updateUserById(id, updates)

    if (!user) {
      throwHttpError(500, 'Could not update user.')
    }

    return res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  const { id } = req.params

  try {
    const user = await UserService.deleteUserById(id)

    if (!user) {
      throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export default { getAll, getById, create, update, destroy }
