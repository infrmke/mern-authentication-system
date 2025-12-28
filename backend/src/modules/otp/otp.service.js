import UserService from '../user/user.service.js'
import OtpRepository from './otp.repository.js'

import throwHttpError from '../../utils/throwHttpError.js'
import generateOtp from '../../utils/generateOtp.js'
import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'

import { sendEmail } from '../../config/nodemailer.js'

const sendUserEmail = async (id) => {
  const capsule = await UserService.findUserById(id)

  if (!capsule) return null

  const { user } = capsule

  if (user.isAccountVerified)
    throwHttpError(
      400,
      'Account has already been verified.',
      'USER_ALREADY_VERIFIED'
    )

  const otpOptions = {
    user: user._id,
    code: generateOtp(),
    type: 'VERIFY',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
  }

  const newOtp = await OtpRepository.createOtp(otpOptions)

  const mail = {
    from: process.env.SMTP_MAILER,
    to: user.email,
    subject: `[GreatShack] Your verification code: ${newOtp.code}`,
    text: `Your one-time verification code is: ${newOtp.code}. This code expires after 15 minutes. If you did not request this, you are free to ignore it.`,
  }

  await sendEmail(mail)

  const formattedUser = formatUserObject(user)

  return formattedUser
}

const sendUserReset = async (filter) => {
  const capsule = await UserService.findUser(filter)

  if (!capsule) return null

  const { user } = capsule

  const otpOptions = {
    user: user._id,
    code: generateOtp(),
    type: 'RESET',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
  }

  const newOtp = await OtpRepository.createOtp(otpOptions)

  const mail = {
    from: process.env.SMTP_MAILER,
    to: user.email,
    subject: `[GreatShack] Your verification code: ${newOtp.code}`,
    text: `Your one-time verification code is: ${newOtp.code}. This code expires after 15 minutes. If you did not request this, you are free to ignore it.`,
  }

  await sendEmail(mail)

  const formattedUser = formatUserObject(user)

  return formattedUser
}

const resendOtp = async (type, filter) => {
  const capsule = await UserService.findUser(filter)

  if (!capsule) return null

  const { user } = capsule

  // deleta o OTP previamente gerado
  await OtpRepository.deleteOtp(user._id, type)

  if (type === 'VERIFY') {
    return await sendUserEmail(user._id)
  } else if (type === 'RESET') {
    return await sendUserReset({ email: user.email })
  }
}

const verifyEmailOtp = async (id, otp, otpType) => {
  const capsule = await UserService.findUserById(id)

  if (!capsule) return null

  const { user } = capsule

  if (user.isAccountVerified)
    throwHttpError(
      400,
      'Account has already been verified.',
      'USER_ALREADY_VERIFIED'
    )

  const otpDocument = await OtpRepository.findOtpById(user._id, 'VERIFY')

  if (!otpDocument) throwHttpError(500, 'Could not verify OTP. Try again.')

  if (
    !otpDocument.code ||
    otp !== otpDocument.code ||
    otpType !== otpDocument.type
  )
    throwHttpError(403, 'Invalid OTP.', 'OTP_NOT_FOUND')

  const updatedUser = await UserService.updateUserById(user._id, {
    isAccountVerified: true,
  })

  if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

  const accessToken = generateToken(
    {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAccountVerified: updatedUser.isAccountVerified,
    },
    process.env.JWT_ACCESS_SECRET,
    '1d'
  )

  await OtpRepository.deleteOtp(id, 'VERIFY')

  return { updatedUser, accessToken }
}

const verifyResetOtp = async (otp, otpType, filter) => {
  const capsule = await UserService.findUser(filter)

  if (!capsule)
    throwHttpError(
      400,
      'Verification failed. User not found.',
      'USER_NOT_FOUND'
    )

  const { user } = capsule

  const otpDocument = await OtpRepository.findOtpById(user._id, 'RESET')

  if (!otpDocument) throwHttpError(500, 'Could not verify OTP. Try again.')

  if (
    !otpDocument.code ||
    otp !== otpDocument.code ||
    otpType !== otpDocument.type
  )
    throwHttpError(403, 'Invalid OTP.', 'OTP_NOT_FOUND')

  await OtpRepository.deleteOtp(user._id, 'RESET')

  const passwordToken = generateToken(
    { id: user._id },
    process.env.JWT_RESET_SECRET,
    '15m'
  )

  return passwordToken
}

const resetPassword = async (filter, password) => {
  const capsule = await UserService.findUser(filter, '+password')

  if (!capsule) return null

  const { user } = capsule

  const updatedUser = await UserService.updateUserById(user._id, { password })

  if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

  return updatedUser
}

export default {
  sendUserEmail,
  sendUserReset,
  resendOtp,
  verifyEmailOtp,
  verifyResetOtp,
  resetPassword,
}
