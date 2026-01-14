import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useOtpLogic from '../hooks/useOtpLogic'
import OtpForm from '../components/OtpForm'

const VerifyPasswordOtp = () => {
  const location = useLocation()
  const navigate = useNavigate()

  //  recuperando o objeto "email" da página ForgotPassword
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const logic = useOtpLogic({
    type: 'RESET',
    email,
    onVerifySuccess: () =>
      navigate('/forgot-password/reset', { state: { email } }),
  })

  return (
    <OtpForm
      logic={logic}
      title="Check your inbox"
      description="Enter the 6-digit password reset code sent to your e-mail. The code expires after 15 minutes."
    />
  )
}

export default VerifyPasswordOtp
