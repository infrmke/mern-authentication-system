import userService from './user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'

class UserController {
  #userService

  constructor(userService) {
    this.#userService = userService
  }

  getAll = async (req, res, next) => {
    const cacheKey = `users_list_${JSON.stringify(req.query)}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // se não houver cache, executa a lógica normal abaixo
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.max(1, parseInt(req.query.limit) || 10)

    try {
      const result = await this.#userService.list(page, limit)

      if (!result) {
        return res.status(200).json({ message: 'There are no registered users.' })
      }

      const { users, totalItems, totalPages, currentPage } = result

      // "links" de navegação
      const nextPage = currentPage < totalPages ? currentPage + 1 : null
      const prevPage = currentPage > 1 ? currentPage - 1 : null

      const paginationData = {
        items: users,
        pagination: {
          totalItems,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
        },
      }

      cache.set(cacheKey, paginationData) // salva os dados no cache
      return res.status(200).json(paginationData)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    const cacheKey = `user_id_${id}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // se não houver cache, executa a lógica normal abaixo
    try {
      const capsule = await this.#userService.show(id)

      if (!capsule) {
        throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')
      }

      const { formattedUser } = capsule

      cache.set(cacheKey, formattedUser) // salva os dados no cache
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  create = async (req, res, next) => {
    const { name, email, password } = req.body

    const data = { name, email, password }

    try {
      const { formattedUser, accessToken } = await this.#userService.store(data)

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })

      // limpa o cache para não retornar dados ultrapassados no próximo GET
      const allCacheKeys = cache.keys()

      const keysToDelete = allCacheKeys.filter(
        (key) => key.startsWith('users_list') || key.startsWith('user_id'),
      )
      if (keysToDelete.length > 0) cache.del(keysToDelete)

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

  update = async (req, res, next) => {
    const { id } = req.params

    try {
      const { name, email, password } = req.body
      const updates = { name, email, password }

      const user = await this.#userService.update(id, updates)

      if (!user) {
        throwHttpError(500, 'Could not update user.')
      }

      // limpa o cache para não retornar dados ultrapassados no próximo GET
      const allCacheKeys = cache.keys()

      const keysToDelete = allCacheKeys.filter(
        (key) =>
          key.startsWith('users_list') ||
          key.startsWith('user_id') ||
          key.startsWith('user_session'),
      )
      if (keysToDelete.length > 0) cache.del(keysToDelete)

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  destroy = async (req, res, next) => {
    const { id } = req.params

    try {
      const user = await this.#userService.destroy(id)

      if (!user) {
        throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')
      }

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
      })

      // limpa o cache para não retornar dados ultrapassados no próximo GET
      const allCacheKeys = cache.keys()

      const keysToDelete = allCacheKeys.filter(
        (key) =>
          key.startsWith('users_list') ||
          key.startsWith('user_id') ||
          key.startsWith('user_session'),
      )
      if (keysToDelete.length > 0) cache.del(keysToDelete)

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController(userService)
