import { useId } from 'react'
import '../styles/entry.css'

const LogIn = () => {
  const emailId = useId()
  const passwordId = useId()

  return (
    <div className="entry">
      <h1>Welcome back!</h1>

      <form className="form">
        <div className="form__group">
          <label htmlFor={emailId}>E-mail address</label>
          <input type="email" name="email" id={emailId} placeholder="E-mail" />
        </div>

        <div className="form__group">
          <label htmlFor={passwordId}>Password</label>
          <input
            type="password"
            name="password"
            id={passwordId}
            placeholder="Password"
          />
        </div>

        <div className="form__group">
          <p>Forgot your password?</p>
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <p>Don't have an account yet? Sign up here</p>
    </div>
  )
}

export default LogIn
