import SessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

const status = async (req, res, next) => {
  try {
    return res.status(200).json(req.user)
  } catch (error) {
    next(error)
  }
}

const logIn = async (req, res, next) => {
  if (req.cookies.accessToken) {
    throwHttpError(400, 'Already logged in.', 'USER_ALREADY_AUTHENTICATED')
  }

  const { email, password } = req.body

  try {
    const capsule = await SessionService.logUserIn(password, { email })

    if (!capsule) {
      throwHttpError(400, 'Incorrect credentials.', 'USER_INVALID_CREDENTIALS')
    }

    const { formattedUser, accessToken } = capsule

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    return res.status(200).json(formattedUser)
  } catch (error) {
    next(error)
  }
}

const logOut = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    throwHttpError(400, 'Already logged out.', 'USER_ALREADY_UNAUTHENTICATED')
  }

  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(200).json({ message: 'User has logged out.' })
  } catch (error) {
    next(error)
  }
}

export default {
  status,
  logIn,
  logOut,
}
