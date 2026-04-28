import sessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'
import clearUserCache from '../../utils/clearUserCache.js'

class SessionController {
  #sessionService

  constructor(sessionService) {
    this.#sessionService = sessionService
  }

  show = async (req, res, next) => {
    const { id } = req.user
    const cacheKey = `user_session_${id}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // se não houver cache, executa a lógica normal abaixo
    try {
      const user = await this.#sessionService.verify(id)

      cache.set(cacheKey, user, 120) // salva os dados no cache com TTL de 2 min
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

      clearUserCache(formattedUser.id) // limpa o cache para não retornar dados ultrapassados
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
      if (req.user.id) {
        clearUserCache(req.user.id) // limpa o cache para não retornar dados ultrapassados
      }

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

export default new SessionController(sessionService)
