import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import api from '../services/axios'

import '../styles/entry.css'

const VerifyPassword = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef([])

  const location = useLocation()
  const navigate = useNavigate()

  //  recuperando o objeto "email" da página ForgotPassword
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    //  se nenhum dígito estiver vazio, chama o handleOtpSubmit()
    if (otp.every((digit) => digit !== '')) {
      handleOtpSubmit(otp.join(''));
    }
  };

  const handleOtpSubmit = async (passwordOtp) => {
    setIsSubmitting(true)

    try {
      await api.post(`/otp/forgot-password/verify/`, { email, otp: passwordOtp })

      //  leva o usuário para a próxima página e passa o objeto "email" à frente
      navigate('/forgot-password/reset', {state: {email}})
    } catch (error) {
      if (error.response.data['code'] === 'OTP_NOT_FOUND') {
        setOtp(new Array(6).fill(''))
        inputRefs.current[0]?.focus()
      }

      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
      setIsSubmitting(false)
    }
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    const passwordOtp = [...otp]
    passwordOtp[index] = element.value
    setOtp(passwordOtp)

    // move o foco para o próximo input após ser preenchido
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }

    //  envia o form se todos os campos estiverem preenchidos
    if (passwordOtp.every((digit) => digit !== '')) {
      handleOtpSubmit(passwordOtp.join(''))
    }
  }

  //  move o foco para o input anterior se o usuário estiver apagando o código
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // permite que o usuário simplesmente cole o otp
  const handlePaste = (e) => {
    e.preventDefault()

    const pastedOtp = e.clipboardData.getData('text')
    const pastedOtpArray = pastedOtp.split('').slice(0, 6)

    if (pastedOtpArray.length > 0) {
      const passwordOtp = [...otp]

      pastedOtpArray.forEach((char, index) => {
        passwordOtp[index] = char
      })

      setOtp(passwordOtp)

      if (pastedOtpArray.length === 6) {
        handleOtpSubmit(pastedOtpArray.join(''))
      }
    }
  }

  return (
    <div className="entry">
      <h1>Check your inbox</h1>
      <p>
        Enter the 6-digit password reset code sent to your e-mail. The code
        expires after 15 minutes.
      </p>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form__group form__group--otp">
          {otp.map((number, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={number}
              aria-label={`${index}° digit`}
              ref={(element) => (inputRefs.current[index] = element)} // vai atribuindo os valores à ref
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined} // apenas recebe ctrl+v no primeiro input
              disabled={isSubmitting}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn"
          disabled={otp.some((digit) => digit === '') || isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Confirm'}
        </button>
      </form>
    </div>
  )
}

export default VerifyPassword
