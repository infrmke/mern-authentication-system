import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { UserContext } from '../context/UserContext'
import api from '../services/axios'

import '../styles/entry.css'

const VerifyEmail = () => {
  const { userData, loading, refreshUserData } = useContext(UserContext)

  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef([])

  const navigate = useNavigate()

  //  envia OTP na primeira montagem
  useEffect(() => {
    const sendEmailOtp = async () => {
      if (loading) return

      if (!userData || !userData.id) return

      try {
        await api.post(`/otp/email/${userData.id}`)
      } catch (error) {
        toast.error(
          error?.response?.data['message'] ||
            "Something didn't work. Try again."
        )
      }
    }

    sendEmailOtp()
  }, [userData, loading])

  const handleFormSubmit = (e) => {
    e.preventDefault();

    //  se nenhum dígito estiver vazio, chama o handleOtpSubmit()
    if (otp.every((digit) => digit !== '')) {
      handleOtpSubmit(otp.join(''));
    }
  };


  const handleOtpSubmit = async (emailOtp) => {
    const { id } = userData
    setIsSubmitting(true)

    try {
      await api.post(`/otp/email/verify/${id}`, { otp: emailOtp })
      await refreshUserData()
      navigate('/home')
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

    const emailOtp = [...otp]
    emailOtp[index] = element.value
    setOtp(emailOtp)

    // move o foco para o próximo input após ser preenchido
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }

    //  envia o form se todos os campos estiverem preenchidos
    if (emailOtp.every((digit) => digit !== '')) {
      handleOtpSubmit(emailOtp.join(''))
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
      const emailOtp = [...otp]

      pastedOtpArray.forEach((char, index) => {
        emailOtp[index] = char
      })

      setOtp(emailOtp)

      if (pastedOtpArray.length === 6) {
        handleOtpSubmit(pastedOtpArray.join(''))
      }
    }
  }

  return (
    <div className="entry">
      <h1>Check your inbox</h1>
      <p>
        Enter the 6-digit code sent to your e-mail. The code expires after 15
        minutes.
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

export default VerifyEmail
