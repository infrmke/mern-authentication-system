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
    throwHttpError(403, 'Invalid OTP or OTP has expired.', 'OTP_NOT_FOUND')

  const updatedUser = await UserService.updateUserById(user._id, {
    isAccountVerified: true,
  })

  if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

  const accessToken = generateToken(
    {
      id: updatedUser._id,
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

const verifyResetOtp = async (otp, otpType, filter, password) => {
  const capsule = await UserService.findUser(filter, '+password')

  if (!capsule) return null

  const { user } = capsule

  const otpDocument = await OtpRepository.findOtpById(user._id, 'RESET')

  if (!otpDocument) throwHttpError(500, 'Could not verify OTP. Try again.')

  if (
    !otpDocument.code ||
    otp !== otpDocument.code ||
    otpType !== otpDocument.type
  )
    throwHttpError(403, 'Invalid OTP or OTP has expired.', 'OTP_NOT_FOUND')

  const updatedUser = await UserService.updateUserById(user._id, { password })

  if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

  await OtpRepository.deleteOtp(user._id, 'RESET')

  return updatedUser
}

export default { sendUserEmail, sendUserReset, verifyEmailOtp, verifyResetOtp }
