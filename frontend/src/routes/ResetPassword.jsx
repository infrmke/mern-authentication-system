import { useId } from 'react'
import '../styles/entry.css'

const ResetPassword = () => {
  const passwordId = useId()
  const confirmPwdId = useId()

  return (
    <div className="entry">
      <h1>Redefine your password</h1>

      <form className="form">
        <div className="form__group">
          <label htmlFor={passwordId}>New password</label>
          <input
            type="password"
            name="password"
            id={passwordId}
            placeholder="Password"
          />
        </div>

        <div className="form__group">
          <label htmlFor={confirmPwdId}>Confirm new password</label>
          <input
            type="password"
            name="confirm_password"
            id={confirmPwdId}
            placeholder="Repeat your password here..."
          />
        </div>

        <button type="submit" className="btn">
          Redefine password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
