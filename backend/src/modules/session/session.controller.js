import SessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class SessionController {
  #sessionService

  constructor(sessionService) {
    this.#sessionService = sessionService
  }

  show = async (req, res, next) => {
    const { id } = req.user

    try {
      const user = await this.#sessionService.verify(id)
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  authenticate = async (req, res, next) => {
    if (req.cookies.accessToken) {
      throwHttpError(400, 'Already logged in.', 'USER_ALREADY_AUTHENTICATED')
    }

    const { email, password } = req.body

    try {
      const capsule = await this.#sessionService.authenticate(password, { email })

      if (!capsule) {
        throwHttpError(400, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')
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

  terminate = async (req, res, next) => {
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
}

export default new SessionController(SessionService)
