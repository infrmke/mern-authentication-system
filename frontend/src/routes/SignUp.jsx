import { useId } from 'react'
import '../styles/entry.css'

const SignUp = () => {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPwdId = useId()

  return (
    <div className="entry">
      <h1>Sign up</h1>
      <p>Enter your details below to create an account</p>

      <form className="form">
        <div className="form__group">
          <label htmlFor={nameId}>Name</label>
          <input
            type="text"
            name="name"
            id={nameId}
            placeholder="First or full name..."
          />
        </div>

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
          <label htmlFor={confirmPwdId}>Confirm password</label>
          <input
            type="password"
            name="confirm_password"
            id={confirmPwdId}
            placeholder="Repeat your password here..."
          />
        </div>

        <button type="submit" className="btn">
          Sign up
        </button>
      </form>

      <p>Already have an account? Sign in here</p>
    </div>
  )
}

export default SignUp
