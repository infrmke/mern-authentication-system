import OtpService from './otp.service.js'

const sendEmailVerification = async (req, res, next) => {
  const { id } = req.user

  try {
    const user = await OtpService.sendUserEmail(id)

    if (!user) {
      return res.status(400).json({
        error: 'Verification failed. Invalid session or user not found.',
      })
    }

    return res.status(200).json({ message: 'OTP has been sent.' })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: `Already sent an e-mail OTP.` })
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    next(error)
  }
}

const sendPasswordReset = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Must provide field "email" to request a password reset.',
    })
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
      return res
        .status(400)
        .json({ error: `Already sent a password reset OTP.` })
    }

    next(error)
  }
}

const verifyUserEmail = async (req, res, next) => {
  const { id } = req.user
  const { otp } = req.body

  if (!otp) {
    return res.status(400).json({
      error: 'Must provide field "otp" for e-mail verification.',
    })
  }

  try {
    const user = await OtpService.verifyEmailOtp(id, otp, 'VERIFY')

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Verification failed. Invalid user or OTP.' })
    }

    res.status(200).json({ message: 'E-mail verified successfully.' })
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    next(error)
  }
}

const resetUserPassword = async (req, res, next) => {
  const { otp, email, password, confirm_password } = req.body

  if (!otp || !email || !password || !confirm_password) {
    return res.status(400).json({
      error:
        'Must provide fields "otp", "email", "password" and "confirm_password" to reset password.',
    })
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters.' })
  }

  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords must match each other.' })
  }

  try {
    const user = await OtpService.verifyResetOtp(
      otp,
      'RESET',
      { email },
      password
    )

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Password reset failed. Invalid user or OTP.' })
    }

    res.status(200).json({ message: 'Password has been reset.' })
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    next(error)
  }
}

export default {
  sendEmailVerification,
  sendPasswordReset,
  verifyUserEmail,
  resetUserPassword,
}
