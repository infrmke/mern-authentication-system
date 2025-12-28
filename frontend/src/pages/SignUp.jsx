import { useContext, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { UserContext } from '../context/UserContext'
import api from '../services/axios'

const SignUp = () => {
  const { setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPwdId = useId()

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { name, email, password, confirm_password } =
      Object.fromEntries(formData)

    try {
      const user = await api.post('/users/create', {
        name,
        email,
        password,
        confirm_password,
      })
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
      <h1>Sign up</h1>
      <p>Enter your details below to create an account</p>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form__group">
          <label htmlFor={nameId}>Name</label>
          <input
            type="text"
            name="name"
            id={nameId}
            placeholder="First or full name..."
            minLength={2}
            maxLength={56}
            autoFocus
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor={emailId}>E-mail address</label>
          <input
            type="email"
            name="email"
            id={emailId}
            placeholder="E-mail"
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor={passwordId}>Password</label>
          <input
            type="password"
            name="password"
            id={passwordId}
            placeholder="Password"
            minLength={8}
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor={confirmPwdId}>Confirm password</label>
          <input
            type="password"
            name="confirm_password"
            id={confirmPwdId}
            placeholder="Repeat your password here..."
            required
          />
        </div>

        <button type="submit" className="btn btn--warning">
          Sign up
        </button>
      </form>

      <p>
        Already have an account? <Link to="/">Sign in here</Link>
      </p>
    </div>
  )
}

export default SignUp
