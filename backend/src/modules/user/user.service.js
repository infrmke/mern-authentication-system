import UserRepository from './user.repository.js'

import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { sendEmail } from '../../config/nodemailer.js'
import { getWelcomeMailOptions } from '../../utils/generateMail.js'

class UserService {
  #userRepository

  constructor(userRepository) {
    this.#userRepository = userRepository
  }

  list = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit

    const { users, totalItems } = await this.#userRepository.findAll(limit, offset)

    if (!users) throwHttpError(500, 'Could not retrieve users.')
    if (users.length === 0) return null

    const formattedUsers = users.map((user) => formatUserObject(user))

    // se existir 11 usuários e o limit for 10, haverá 2 páginas
    const totalPages = Math.ceil(totalItems / limit)

    return {
      users: formattedUsers,
      totalItems,
      totalPages,
      currentPage: page,
    }
  }

  find = async (filter, projection = {}) => {
    const user = await this.#userRepository.findOne(filter, projection)

    if (!user) return null

    const formattedUser = formatUserObject(user)

    return { user, formattedUser }
  }

  show = async (id) => {
    const user = await this.#userRepository.findById(id)

    if (!user) return null

    const formattedUser = formatUserObject(user)

    return { user, formattedUser }
  }

  store = async (data) => {
    const user = await this.#userRepository.create(data)

    if (!user) throwHttpError(500, 'Could not create user.')

    const formattedUser = formatUserObject(user)

    const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_SECRET, '1d')

    const mail = getWelcomeMailOptions(data.name, data.email)
    await sendEmail(mail)

    return { formattedUser, accessToken }
  }

  update = async (id, data) => {
    const user = await this.#userRepository.update(id, data)

    if (!user) return null

    const formattedUser = formatUserObject(user)

    return formattedUser
  }

  destroy = async (id) => {
    const user = await this.#userRepository.remove(id)

    if (!user) return null

    const formattedUser = formatUserObject(user)

    return formattedUser
  }
}

export default new UserService(UserRepository)
