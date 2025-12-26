import OtpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

const status = async (req, res, next) => {
  return res.status(200).json({ active: true, message: 'The password reset session is still active.'})
}

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

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body

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

  try {
    const capsule = await OtpService.verifyEmailOtp(id, otp, 'VERIFY')

    if (!capsule) {
      throwHttpError(
        400,
        'Verification failed. Invalid OTP or user not found.',
        'USER_NOT_FOUND'
      )
    }

    const { accessToken } = capsule

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    res.status(200).json({ message: 'E-mail verified successfully.' })
  } catch (error) {
    next(error)
  }
}

const verifyPasswordOtp = async (req, res, next) => {
  const { email, otp } = req.body

  try {
    const passwordToken = await OtpService.verifyResetOtp(otp, 'RESET', {
      email,
    })

    res.cookie('passwordToken', passwordToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
    })

    res
      .status(200)
      .json({ message: 'OTP has been verified. Proceed to password reset.' })
  } catch (error) {
    next(error)
  }
}

const resetUserPassword = async (req, res, next) => {
  const { email, new_password } = req.body

  try {
    const user = await OtpService.resetPassword(email, new_password)

    if (!user)
      throwHttpError(
        400,
        'Verification failed. Invalid session or user not found.',
        'USER_NOT_FOUND'
      )

    res.clearCookie('passwordToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export default {
  status,
  sendEmailVerification,
  requestPasswordReset,
  verifyUserEmail,
  verifyPasswordOtp,
  resetUserPassword,
}
