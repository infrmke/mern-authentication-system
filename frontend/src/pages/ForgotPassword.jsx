import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AtSign } from 'lucide-react'

import useFormSubmit from '../hooks/useFormSubmit'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

import api from '../services/axios'

const ForgotPassword = () => {
  const emailId = useId()
  const navigate = useNavigate()

  const handleRequest = async (data) => {
    const response = await api.post('/otps/password-reset/request', data)
    toast.success(response.data['message'], { duration: 6000 })

    // leva o usuário para a próxima página e passa o objeto "email" à frente
    navigate('/forgot-password/verify', { state: { email: data.email } })
  }

  const { handleSubmit } = useFormSubmit(handleRequest)

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Forgot password?"
        description="Enter the e-mail associated with your account and you'll be sent a code to redefine your password."
        onSubmit={handleSubmit}
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
