import { useId } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import '../styles/entry.css'
import api from '../services/axios'

const ResetPassword = () => {
  const passwordId = useId()
  const confirmPwdId = useId()

  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const {new_password, confirm_password} = Object.fromEntries(formData)

    try {
      await api.patch('/otp/forgot-password/reset', {email, new_password, confirm_password})
      navigate('/')
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
    }
    }

  return (
    <div className="entry">
      <h1>Change your password</h1>
      <p>Enter a new password below to change your password.</p>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form__group">
          <label htmlFor={passwordId}>New password</label>
          <input
            type="password"
            name="new_password"
            id={passwordId}
            placeholder="Password"
            autoFocus
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor={confirmPwdId}>Confirm new password</label>
          <input
            type="password"
            name="confirm_password"
            id={confirmPwdId}
            placeholder="Repeat your password here..."
            required
          />
        </div>

        <button type="submit" className="btn">
          Reset password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
