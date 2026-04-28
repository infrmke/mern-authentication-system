import otpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'

class OtpController {
  #otpService

  constructor(otpService) {
    this.#otpService = otpService
  }

  show = async (req, res, next) => {
    const identifier = req.cookies.passwordToken.split('.')[1]
    const cacheKey = `password_reset_${identifier}`

    const cachedData = cache.get(cacheKey)

    // tenta buscar o resultado da requisição no cache primeiro
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // se não houver cache, executa a lógica normal abaixo
    const resetStatus = {
      active: true,
      message: 'The password reset session is active.',
    }

    cache.set(cacheKey, resetStatus) // salva os dados no cache
    return res.status(200).json(resetStatus)
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
    const userIdFromToken = req.user?.id // disponível se o usuário estiver logado ('VERIFY')

    const identifier = type === 'VERIFY' ? userIdFromToken : email
    const cacheKey = `otp_cooldown_${type}_${identifier}`

    try {
      // verificar se o cooldown de 60s está ativo
      if (cache.has(cacheKey)) {
        throwHttpError(
          429,
          'Please wait 60 seconds before requesting a new code.',
          'OTP_COOLDOWN_TIME',
        )
      }

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

      cache.set(cacheKey, true, 60) // ativa o cooldown no cache
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

export default new OtpController(otpService)
