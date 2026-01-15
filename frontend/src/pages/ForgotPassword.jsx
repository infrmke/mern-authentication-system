import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AtSign } from 'lucide-react'

import api from '../services/axios'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

const ForgotPassword = () => {
  const emailId = useId()
  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { email } = Object.fromEntries(formData)

    try {
      const response = await api.post('/otps/password-reset/request', { email })
      toast.success(response.data['message'], { duration: 6000 })

      //  leva o usuário para a próxima página e passa o objeto "email" à frente
      navigate('/forgot-password/verify', { state: { email } })
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
    }
  }

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Forgot password?"
        description="Enter the e-mail associated with your account and you'll be sent a code to redefine your password."
        onSubmit={handleEmailSubmit}
        buttonText="Request code"
      >
        <InputGroup
          label="E-mail address"
          icon={AtSign}
          type="email"
          name="email"
          id={emailId}
          placeholder="Your e-mail here..."
          autoFocus
        />
      </EntryCard>
    </div>
  )
}

export default ForgotPassword
