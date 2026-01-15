import { useContext, useId } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { Lock } from 'lucide-react'

import useTitle from '../hooks/useTitle'
import { UserContext } from '../context/UserContext'
import useFormSubmit from '../hooks/useFormSubmit'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'

import api from '../services/axios'

const LogIn = () => {
  useTitle('Log in')

  const { setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const emailId = useId()
  const passwordId = useId()

  const handleLogin = async (data) => {
    const user = await api.post('/sessions/login', data)
    setUserData(user['data'])
    navigate('/home')
  }

  const { handleSubmit } = useFormSubmit(handleLogin)

  return (
    <div className="entry fade-in">
      <EntryCard
        title="Welcome back!"
        onSubmit={handleSubmit}
        buttonText="Login"
      >
        <InputGroup
          label="E-mail address"
          icon={User}
          type="email"
          name="email"
          id={emailId}
          placeholder="E-mail"
          autoFocus
        />
        <InputGroup
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          id={passwordId}
          placeholder="Password"
        />
        <div className="form__group">
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </EntryCard>

      <div className="redirect">
        <p>
          Don't have an account yet? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default LogIn
