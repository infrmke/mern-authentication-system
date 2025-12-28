import { useId } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LockOpen, Lock } from 'lucide-react'

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
    const { new_password, confirm_password } = Object.fromEntries(formData)

    try {
      await api.patch('/otp/forgot-password/reset', {
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
    <div className="entry">
      <h1>Change your password</h1>
      <p>Enter a new password below to change your password.</p>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form__group">
          <label htmlFor={passwordId}>New password</label>

          <div className="form__group form__group--addon">
            <span className="form__icon">
              <LockOpen color="hsl(220, 10%, 46%)" />
            </span>
            <input
              type="password"
              name="new_password"
              id={passwordId}
              placeholder="Password"
              autoFocus
              required
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor={confirmPwdId}>Confirm new password</label>

          <div className="form__group form__group--addon">
            <span className="form__icon">
              <Lock color="hsl(220, 10%, 46%)" />
            </span>
            <input
              type="password"
              name="confirm_password"
              id={confirmPwdId}
              placeholder="Repeat your password here..."
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn--warning">
          Reset password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
