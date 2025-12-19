import UserService from './user.service.js'

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
      return res.status(400).json({ error: 'User does not exist.' })
    }

    const { formattedUser } = capsule

    return res.status(200).json(formattedUser)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error:
        'Must provide fields "name", "email" and "password" for registration.',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters.',
    })
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
      return res
        .status(400)
        .json({ error: `Provided ${field.toUpperCase()} already exists.` })
    }

    next(error)
  }
}

export default { getAllUsers, getUser, createUser }
