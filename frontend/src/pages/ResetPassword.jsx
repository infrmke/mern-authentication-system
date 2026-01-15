import { useId } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LockOpen, Lock } from 'lucide-react'

import useFormSubmit from '../hooks/useFormSubmit'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

import api from '../services/axios'

const ResetPassword = () => {
  const passwordId = useId()
  const confirmPwdId = useId()

  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const handleReset = async (data) => {
    await api.patch('/otps/password-reset', { email, ...data })
    toast.success('Your password has been changed!', { duration: 6000 })
    navigate('/')
  }

  const { handleSubmit } = useFormSubmit(handleReset)

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Change your password"
        description="Enter a new password below to change your password."
        onSubmit={handleSubmit}
        buttonText="Reset password"
      >
        <InputGroup
          label="New password"
          icon={LockOpen}
          type="password"
          name="new_password"
          id={passwordId}
          placeholder="Password"
          autoFocus
        />

        <InputGroup
          label="Confirm new password"
          icon={Lock}
          type="password"
          name="confirm_password"
          id={confirmPwdId}
          placeholder="Repeat your password here..."
          autoFocus
        />
      </EntryCard>
    </div>
  )
}

export default ResetPassword
