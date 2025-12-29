import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AtSign } from 'lucide-react'

import api from '../services/axios'

const ForgotPassword = () => {
  const emailId = useId()
  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { email } = Object.fromEntries(formData)

    try {
      const response = await api.post('/otp/forgot-password', { email })
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
      <h1>Forgot password?</h1>
      <p>
        Enter the e-mail associated with your account and you'll be sent a code
        to redefine your password.
      </p>

      <form className="form" onSubmit={handleEmailSubmit}>
        <div className="form__group">
          <label htmlFor={emailId}>E-mail address</label>

          <div className="form__group form__group--addon">
            <span className="form__icon">
              <AtSign color="hsl(220, 10%, 46%)" />
            </span>
            <input
              type="email"
              name="email"
              id={emailId}
              placeholder="Your e-mail here..."
              autoFocus
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn--warning">
          Request code
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
