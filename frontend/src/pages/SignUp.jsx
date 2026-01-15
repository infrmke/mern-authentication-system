import { useContext, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, AtSign, LockOpen, Lock } from 'lucide-react'

import useTitle from '../hooks/useTitle'
import { UserContext } from '../context/UserContext'
import useFormSubmit from '../hooks/useFormSubmit'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

import api from '../services/axios'

const SignUp = () => {
  useTitle('Register')

  const { setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPwdId = useId()

  const handleSignUp = async (data) => {
    const user = await api.post('/users', data)
    setUserData(user['data'])
    navigate('/home')
  }

  const { handleSubmit } = useFormSubmit(handleSignUp)

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Register"
        description="Enter your details below to create an account"
        onSubmit={handleSubmit}
        buttonText="Sign up"
      >
        <InputGroup
          label="Name"
          icon={User}
          type="text"
          name="name"
          id={nameId}
          placeholder="First or full name"
          minLength={2}
          maxLength={56}
          autoFocus
        />

        <InputGroup
          label="E-mail address"
          icon={AtSign}
          type="email"
          name="email"
          id={emailId}
          placeholder="E-mail"
        />

        <InputGroup
          label="Password"
          icon={LockOpen}
          type="password"
          name="password"
          id={passwordId}
          placeholder="Password"
          minLength={8}
        />

        <InputGroup
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirm_password"
          id={confirmPwdId}
          placeholder="Repeat your password here..."
        />
      </EntryCard>

      <div className="redirect">
        <p>
          Already have an account? <Link to="/">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
