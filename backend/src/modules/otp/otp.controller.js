import OtpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

const sendEmailVerification = async (req, res, next) => {
  const { id } = req.user

  try {
    const user = await OtpService.sendUserEmail(id)

    if (!user) {
      throwHttpError(
        400,
        'Verification failed. Invalid session or user not found.',
        'USER_NOT_FOUND'
      )
    }

    return res.status(200).json({ message: 'OTP has been sent.' })
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409
      error.message =
        'An active e-mail OTP has already been sent to this account.'
      error.code = 'OTP_ALREADY_SENT'
    }

    next(error)
  }
}

const sendPasswordReset = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    throwHttpError(
      400,
      'Must provide field "email" to request a password reset.',
      'OTP_MISSING_FIELDS'
    )
  }

  try {
    //  não captura o retorno porque o service lida com o caso de usuário não encontrado
    await OtpService.sendUserReset({ email })

    return res.status(200).json({
      message:
        'If the e-mail is registered, a password reset OTP has been sent.',
    })
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409
      error.message =
        'An active password reset OTP has already been sent to this account.'
      error.code = 'OTP_ALREADY_SENT'
    }

    next(error)
  }
}

const verifyUserEmail = async (req, res, next) => {
  const { id } = req.user
  const { otp } = req.body

  if (!otp) {
    throwHttpError(
      400,
      'Must provide field "otp" for e-mail verification.',
      'OTP_MISSING_FIELDS'
    )
  }

  try {
    const user = await OtpService.verifyEmailOtp(id, otp, 'VERIFY')

    if (!user) {
      throwHttpError(
        400,
        'Verification failed. Invalid OTP or user not found.',
        'USER_NOT_FOUND'
      )
    }

    res.status(200).json({ message: 'E-mail verified successfully.' })
  } catch (error) {
    next(error)
  }
}

const resetUserPassword = async (req, res, next) => {
  const { otp, email, password, confirm_password } = req.body

  if (!otp || !email || !password || !confirm_password) {
    throwHttpError(
      400,
      'Must provide fields "otp", "email", "password" and "confirm_password" to reset password.',
      'OTP_MISSING_FIELDS'
    )
  }

  if (password.length < 8) {
    throwHttpError(
      400,
      'Password must be at least 8 characters.',
      'PASSWORD_TOO_SHORT'
    )
  }

  if (password !== confirm_password) {
    throwHttpError(
      400,
      'Passwords must match each other.',
      'PASSWORD_NOT_EQUAL'
    )
  }

  try {
    const user = await OtpService.verifyResetOtp(
      otp,
      'RESET',
      { email },
      password
    )

    if (!user) {
      throwHttpError(
        400,
        'Verification failed. Invalid OTP or user not found.',
        'USER_NOT_FOUND'
      )
    }

    res.status(200).json({ message: 'Password has been reset.' })
  } catch (error) {
    next(error)
  }
}

export default {
  sendEmailVerification,
  sendPasswordReset,
  verifyUserEmail,
  resetUserPassword,
}
