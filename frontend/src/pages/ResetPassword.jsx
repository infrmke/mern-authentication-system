import { useId } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LockOpen, Lock } from 'lucide-react'

import api from '../services/axios'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

const ResetPassword = () => {
  const passwordId = useId()
  const confirmPwdId = useId()

  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const handleResetSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { new_password, confirm_password } = Object.fromEntries(formData)

    try {
      await api.patch('/otps/password-reset', {
        email,
        new_password,
        confirm_password,
      })
      toast.success('Your password has been changed!', { duration: 6000 })
      navigate('/')
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
    }
  }

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Change your password"
        description="Enter a new password below to change your password."
        onSubmit={handleResetSubmit}
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
