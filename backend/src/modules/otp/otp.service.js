import UserService from '../user/user.service.js'
import OtpRepository from './otp.repository.js'

import throwHttpError from '../../utils/throwHttpError.js'
import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'

import { createOtpOptions } from '../../utils/generateOtp.js'
import { getOtpMailOptions } from '../../utils/generateMail.js'
import { sendEmail } from '../../config/nodemailer.js'

class OtpService {
  #otpRepository
  #userService

  constructor(otpRepository, userService) {
    this.#otpRepository = otpRepository
    this.#userService = userService
  }

  sendVerification = async (id) => {
    const capsule = await this.#userService.show(id)

    if (!capsule) return null

    const { user } = capsule

    if (user.isAccountVerified)
      throwHttpError(400, 'Account has already been verified.', 'USER_ALREADY_VERIFIED')

    const otpOptions = createOtpOptions(user._id, 'VERIFY')
    const newOtp = await this.#otpRepository.create(otpOptions)

    const mail = getOtpMailOptions(user.email, newOtp.code, 'VERIFY')
    await sendEmail(mail)

    const formattedUser = formatUserObject(user)

    return formattedUser
  }

  sendReset = async (filter) => {
    const capsule = await this.#userService.find(filter)

    if (!capsule) return null

    const { user } = capsule

    const otpOptions = createOtpOptions(user._id, 'RESET')
    const newOtp = await this.#otpRepository.create(otpOptions)

    const mail = getOtpMailOptions(user.email, newOtp.code, 'RESET')
    await sendEmail(mail)

    const formattedUser = formatUserObject(user)

    return formattedUser
  }

  resend = async (type, filter) => {
    const capsule = await this.#userService.find(filter)

    if (!capsule) return null

    const { user } = capsule

    // deleta o OTP previamente gerado
    await this.#otpRepository.remove(user._id, type)

    if (type === 'VERIFY') {
      return await this.sendVerification(user._id)
    } else if (type === 'RESET') {
      return await this.sendReset({ email: user.email })
    }
  }

  validateEmail = async (id, otp, otpType) => {
    const capsule = await this.#userService.show(id)

    if (!capsule) return null

    const { user } = capsule

    if (user.isAccountVerified)
      throwHttpError(400, 'Account has already been verified.', 'USER_ALREADY_VERIFIED')

    const otpDocument = await this.#otpRepository.findById(user._id, 'VERIFY')

    if (!otpDocument) throwHttpError(500, 'Could not verify code. Try again.')

    if (!otpDocument.code || otp !== otpDocument.code || otpType !== otpDocument.type)
      throwHttpError(403, 'Invalid code.', 'OTP_NOT_FOUND')

    const updatedUser = await this.#userService.update(user._id, {
      isAccountVerified: true,
    })

    if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

    await this.#otpRepository.remove(id, 'VERIFY')

    return updatedUser
  }

  validateReset = async (otp, otpType, filter) => {
    const capsule = await this.#userService.find(filter)

    if (!capsule) throwHttpError(400, 'Verification failed. User not found.', 'USER_NOT_FOUND')

    const { user } = capsule

    const otpDocument = await this.#otpRepository.findById(user._id, 'RESET')

    if (!otpDocument) throwHttpError(500, 'Could not verify code. Try again.')

    if (!otpDocument.code || otp !== otpDocument.code || otpType !== otpDocument.type)
      throwHttpError(403, 'Invalid code.', 'OTP_NOT_FOUND')

    await this.#otpRepository.remove(user._id, 'RESET')

    const passwordToken = generateToken({ id: user._id }, process.env.JWT_RESET_SECRET, '15m')

    return passwordToken
  }

  resetPassword = async (filter, password) => {
    const capsule = await this.#userService.find(filter, '+password')

    if (!capsule) return null

    const { user } = capsule

    const updatedUser = await this.#userService.update(user._id, { password })

    if (!updatedUser) throwHttpError(500, 'Could not update user. Try again.')

    return updatedUser
  }
}

export default new OtpService(OtpRepository, UserService)
