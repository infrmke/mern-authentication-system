import { useContext, useId } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { User } from 'lucide-react'
import { Lock } from 'lucide-react'

import useTitle from '../hooks/useTitle'
import { UserContext } from '../context/UserContext'
import api from '../services/axios'

const LogIn = () => {
  useTitle('Log in')

  const { setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const emailId = useId()
  const passwordId = useId()

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { email, password } = Object.fromEntries(formData)

    try {
      const user = await api.post('/auth/login', { email, password })
      setUserData(user['data'])
      navigate('/home')
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || "Something didn't work. Try again."
      )
    }
  }

  return (
    <div className="entry">
      <h1>Welcome back!</h1>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form__group">
          <label htmlFor={emailId}>E-mail address</label>

          <div className="form__group form__group--addon">
            <span className="form__icon">
              <User color="hsl(220, 10%, 46%)" />
            </span>
            <input
              type="email"
              name="email"
              id={emailId}
              placeholder="E-mail"
              autoFocus
              required
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor={passwordId}>Password</label>

          <div className="form__group form__group--addon">
            <span className="form__icon">
              <Lock color="hsl(220, 10%, 46%)" />
            </span>
            <input
              type="password"
              name="password"
              id={passwordId}
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div className="form__group">
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>

        <button type="submit" className="btn btn--warning">
          Login
        </button>
      </form>

      <p>
        Don't have an account yet? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  )
}

export default LogIn
