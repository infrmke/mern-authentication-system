import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserContext } from '../context/UserContext'
import useOtpLogic from '../hooks/useOtpLogic'
import OtpForm from '../components/OtpForm'

const VerifyEmailOtp = () => {
  const { userData, refreshUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const logic = useOtpLogic({
    type: 'VERIFY',
    userId: userData?.id,
    onVerifySuccess: async () => {
      await refreshUserData()
      navigate('/home')
    },
    autoSend: true,
  })

  return (
    <OtpForm
      logic={logic}
      title="Check your inbox"
      description="Enter the 6-digit code sent to your e-mail. The code expires after 15 minutes."
    />
  )
}

export default VerifyEmailOtp
