import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/axios'
import useApi from './useApi'

const useOtpLogic = ({ type, email, userId, onVerifySuccess, autoSend = false }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [timer, setTimer] = useState(0)

  // dois hooks separados para loadings independentes
  const { request: verifyRequest, loading: isSubmitting } = useApi()
  const { request: resendRequest, loading: isResending } = useApi()

  const inputRefs = useRef([])
  const hasSentInitialOtp = useRef(false)

  // envia o OTP na primeira montagem caso a  autoSend seja true
  useEffect(() => {
    if (!autoSend || hasSentInitialOtp.current) return

    const sendInitialOtp = async () => {
      try {
        // impede que o otp seja enviado mais de uma vez na primeira montagem do componente
        hasSentInitialOtp.current = true

        // uso direto do axios para evitar o estado de loading de useApi()
        await api.post(`/otps/email-verification/${userId}`)
      } catch {
        hasSentInitialOtp.current = false
        toast.error('Failed to send code. Try again.') // erro genérico
      }
    }

    if (userId) sendInitialOtp()
  }, [autoSend, verifyRequest, userId])

  // timer de reenvio
  useEffect(() => {
    let interval = null

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [timer])

  // handler: envia o otp
  const handleOtpSubmit = async (currentOtp) => {
    try {
      // se o type for VERIFY, aponta para a rota de verificação de e-mail.
      // Se for RESET, para a rota de redefinição de senha
      const endpoint =
        type === 'VERIFY'
          ? `/otps/email-verification/check/${userId}`
          : `/otps/password-reset/check/`

      // o endpoint para verificação de e-mail recebe apenas o otp
      // e a redefinição de senha recebe e-mail e otp
      const payload = type === 'VERIFY' ? { otp: currentOtp } : { email, otp: currentOtp }

      await verifyRequest({ url: endpoint, method: 'POST', data: payload })
      await onVerifySuccess()
    } catch (error) {
      // se o código for inválido, limpa os inputs e foca no primeiro
      if (error.response?.data['code'] === 'OTP_NOT_FOUND') {
        setOtp(new Array(6).fill(''))
        inputRefs.current[0]?.focus()
      }
    }
  }

  // handler: reenvia o otp
  const handleResend = async () => {
    try {
      // se o otp for do tipo VERIFY, envia apenas o type. Se for RESET, envia email e type
      const payload = type === 'VERIFY' ? { type } : { email, type }
      const data = await resendRequest(
        {
          url: '/otps/resend',
          method: 'POST',
          data: payload,
        },
        true,
        'Failed to resend code. Try again.'
      )
      toast.success(data.message)
      setTimer(60)
    } catch {
      // o hook useApi() lida com os erros; não é necessário catch(error)
    }
  }

  // handler: evento onChange
  const handleChange = (value, index) => {
    if (isNaN(value)) return false

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // move o foco para o próximo input após ser preenchido
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }

    // envia o form se todos os campos estiverem preenchidos
    if (newOtp.every((digit) => digit !== '')) {
      handleOtpSubmit(newOtp.join(''))
    }
  }

  // handler: evento onkeyDown
  // move o foco para o input anterior se o usuário estiver apagando o código
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // handler: evento onPaste
  // permite que o usuário simplesmente cole o otp
  const handlePaste = (e) => {
    e.preventDefault()

    // pega tudo o que for número e apenas número
    const pastedOtp = e.clipboardData.getData('text').replace(/\D/g, '')
    const pastedOtpArray = pastedOtp.split('').slice(0, 6)

    if (pastedOtpArray.length > 0) {
      const newOtp = [...otp]

      pastedOtpArray.forEach((char, index) => {
        newOtp[index] = char
      })

      setOtp(newOtp)

      if (pastedOtpArray.length === 6) {
        handleOtpSubmit(pastedOtpArray.join(''))
      }
    }
  }

  return {
    otp,
    type,
    timer,
    isSubmitting,
    isResending,
    inputRefs,
    handleOtpSubmit,
    handleResend,
    handleChange,
    handleKeyDown,
    handlePaste,
  }
}

export default useOtpLogic
