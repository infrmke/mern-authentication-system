import { useId } from 'react'
import '../styles/entry.css'

const ForgotPassword = () => {
  const emailId = useId()

  return (
    <div className="entry">
      <h1>I can help you with that!</h1>
      <p>
        Inform the e-mail you used to register an account down below and you'll
        be sent a code to redefine your password
      </p>

      <form className="form">
        <div className="form__group">
          <label htmlFor={emailId}>E-mail address</label>
          <input
            type="email"
            name="email"
            id={emailId}
            placeholder="Your e-mail here..."
          />
        </div>

        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
