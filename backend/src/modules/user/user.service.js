import UserRepository from './user.repository.js'

import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { sendEmail } from '../../config/nodemailer.js'
import { getWelcomeMailOptions } from '../../utils/generateMail.js'

const list = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit

  const { users, totalItems } = await UserRepository.findAll(limit, offset)

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

const find = async (filter, projection = undefined) => {
  const user = await UserRepository.findOne(filter, projection)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return { user, formattedUser }
}

const show = async (id) => {
  const user = await UserRepository.findById(id)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return { user, formattedUser }
}

const store = async (data) => {
  const user = await UserRepository.create(data)

  if (!user) throwHttpError(500, 'Could not create user.')

  const formattedUser = formatUserObject(user)

  const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_SECRET, '1d')

  const mail = getWelcomeMailOptions(data.name, data.email)
  await sendEmail(mail)

  return { formattedUser, accessToken }
}

const update = async (id, data) => {
  const user = await UserRepository.update(id, data)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return formattedUser
}

const destroy = async (id) => {
  const user = await UserRepository.remove(id)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return formattedUser
}

export default {
  list,
  find,
  show,
  store,
  update,
  destroy,
}
