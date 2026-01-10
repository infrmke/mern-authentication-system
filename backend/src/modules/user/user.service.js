import UserRepository from './user.repository.js'

import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { sendEmail } from '../../config/nodemailer.js'
import { getWelcomeMailOptions } from '../../utils/generateMail.js'

const findAllUsers = async () => {
  const users = await UserRepository.findAll()

  if (!users) throwHttpError(500, 'Could not retrieve users.')

  if (users.length === 0) return null

  const formattedUsers = users.map((user) => formatUserObject(user))

  return formattedUsers
}

const findUser = async (filter, projection = undefined) => {
  const user = await UserRepository.findOne(filter, projection)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return { user, formattedUser }
}

const findUserById = async (id) => {
  const user = await UserRepository.findById(id)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return { user, formattedUser }
}

const createUser = async (data) => {
  const user = await UserRepository.create(data)

  if (!user) throwHttpError(500, 'Could not create user.')

  const formattedUser = formatUserObject(user)

  const accessToken = generateToken(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
    },
    process.env.JWT_ACCESS_SECRET,
    '1d'
  )

  const mail = getWelcomeMailOptions(data.name, data.email)
  await sendEmail(mail)

  return { formattedUser, accessToken }
}

const updateUserById = async (id, data) => {
  const user = await UserRepository.updateById(id, data)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return formattedUser
}

const deleteUserById = async (id) => {
  const user = await UserRepository.deleteById(id)

  if (!user) return null

  const formattedUser = formatUserObject(user)

  return formattedUser
}

export default {
  findAllUsers,
  findUser,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
}
