import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/axios'

const useOtpLogic = ({
  type,
  email,
  userId,
  onVerifySuccess,
  autoSend = false,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef([])
  const hasSentInitialOtp = useRef(false)

  // envia o OTP na primeira montagem caso a autoSend seja true
  useEffect(() => {
    if (!autoSend || hasSentInitialOtp.current) return

    const sendInitialOtp = async () => {
      try {
        // impede que o otp seja enviado mais de uma vez na primeira montagem do componente
        hasSentInitialOtp.current = true
        await api.post(`/otps/email-verification/${userId}`)
      } catch (error) {
        hasSentInitialOtp.current = false
        toast.error(
          error?.response?.data['message'] || 'Failed to send code. Try again.'
        )
      }
    }

    if (userId) sendInitialOtp()
  }, [autoSend, userId])

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

  const handleOtpSubmit = async (currentOtp) => {
    setIsSubmitting(true)

    try {
      // se o type for VERIFY, aponta para a rota de verificação de e-mail.
      // Se for RESET, para a rota de redefinição de senha
      const endpoint =
        type === 'VERIFY'
          ? `/otps/email-verification/check/${userId}`
          : `/otps/password-reset/check/`

      // o endpoint para verificação de e-mail recebe apenas o otp
      // e a redefinição de senha recebe e-mail e otp
      const payload =
        type === 'VERIFY' ? { otp: currentOtp } : { email, otp: currentOtp }

      await api.post(endpoint, payload)
      await onVerifySuccess()
    } catch (error) {
      setIsSubmitting(false)
      if (error.response?.data['code'] === 'OTP_NOT_FOUND') {
        setOtp(new Array(6).fill('')) // limpa os inputs
        inputRefs.current[0]?.focus() // foca no primeiro input
      }

      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      // se o otp for do tipo VERIFY, envia apenas o type. Se for RESET, envia email e type
      const payload = type === 'VERIFY' ? { type } : { email, type }
      const response = await api.post('/otps/resend', payload)

      toast.success(response.data['message'])
      setTimer(60)
    } catch (error) {
      toast.error(
        error.response?.data['message'] || 'Failed to resend code. Try again.'
      )
    } finally {
      setIsResending(false)
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
  //  move o foco para o input anterior se o usuário estiver apagando o código
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
