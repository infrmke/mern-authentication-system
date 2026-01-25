import OtpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class OtpController {
  #otpService

  constructor(otpService) {
    this.#otpService = otpService
  }

  show = async (req, res, next) => {
    return res.status(200).json({
      active: true,
      message: 'The password reset session is active.',
    })
  }

  requestVerification = async (req, res, next) => {
    const { id } = req.params

    try {
      const user = await this.#otpService.sendVerification(id)

      if (!user) {
        throwHttpError(
          400,
          'Verification failed. Invalid session or user not found.',
          'USER_NOT_FOUND',
        )
      }

      return res.status(200).json({ message: 'Code has been sent.' })
    } catch (error) {
      if (error.code === 11000) {
        error.status = 409
        error.message = 'An active e-mail code has already been sent to this account.'
        error.code = 'OTP_ALREADY_SENT'
      }

      next(error)
    }
  }

  requestReset = async (req, res, next) => {
    const { email } = req.body

    try {
      //  não captura o retorno porque o service lida com o caso de usuário não encontrado
      await this.#otpService.sendReset({ email })

      return res.status(200).json({
        message: 'If the e-mail is registered, a code has been sent.',
      })
    } catch (error) {
      if (error.code === 11000) {
        error.status = 409
        error.message = 'An active password reset code has already been sent to this account.'
        error.code = 'OTP_ALREADY_SENT'
      }

      next(error)
    }
  }

  resendCode = async (req, res, next) => {
    const { email, type } = req.body

    // disponível se o usuário estiver logado ('VERIFY')
    const userIdFromToken = req.user?.id

    try {
      let filter

      if (type === 'VERIFY' && userIdFromToken) {
        filter = { _id: userIdFromToken }
      } else if (type === 'RESET' && email) {
        filter = { email }
      } else {
        throwHttpError(400, 'Invalid request body.', 'BAD_REQUEST')
      }

      const result = await this.#otpService.resend(type, filter)

      if (!result) {
        throwHttpError(404, 'User does not exist.', 'USER_NOT_FOUND')
      }

      return res.status(200).json({ message: 'A new code has been sent.' })
    } catch (error) {
      next(error)
    }
  }

  verifyEmail = async (req, res, next) => {
    const { id } = req.params
    const { otp } = req.body

    try {
      const user = await this.#otpService.validateEmail(id, otp, 'VERIFY')

      if (!user) {
        throwHttpError(
          400,
          'Verification failed. Invalid code or user not found.',
          'USER_NOT_FOUND',
        )
      }

      res.status(200).json({ message: 'E-mail verified successfully.' })
    } catch (error) {
      next(error)
    }
  }

  verifyReset = async (req, res, next) => {
    const { email, otp } = req.body

    try {
      const passwordToken = await this.#otpService.validateReset(otp, 'RESET', {
        email,
      })

      res.cookie('passwordToken', passwordToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000, // 15 minutos
      })

      res.status(200).json({ message: 'Code has been verified. Proceed to password reset.' })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req, res, next) => {
    const { email, new_password } = req.body

    try {
      const user = await this.#otpService.resetPassword({ email }, new_password)

      if (!user)
        throwHttpError(
          400,
          'Verification failed. Invalid session or user not found.',
          'USER_NOT_FOUND',
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
}

export default new OtpController(OtpService)
