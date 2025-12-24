import UserRepository from './user.repository.js'

import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'

import { sendEmail } from '../../config/nodemailer.js'

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

  const mail = {
    from: process.env.SMTP_MAILER,
    to: data.email,
    subject: 'Welcome to GreatStack',
    text: `Welcome to a website made by GreatStack. Your account has been created with the following e-mail: ${data.email}. If you happen to have no idea what this e-mail might be about, I'm just a software developer trying something new and I'm sorry I accidentally sent this e-mail to you thinking that it would go nowhere. Just ignore it.`,
  }

  await sendEmail(mail)

  return { formattedUser, accessToken }
}

const updateUserById = async (id, data) => {
  const user = await UserRepository.updateById(id, data)

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
}
