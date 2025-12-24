import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'

import '../styles/section.css'

const Home = () => {
  const { userData } = useContext(UserContext)

  return (
    <section className="user">
      <h1>Welcome, {userData?.name || '[user]'}!</h1>

      {!userData?.isAccountVerified ? (
        <div className="user__email">
          <p>Could you verify your e-mail?</p>
          <Link to="/email/verify" className="btn">
            Verify e-mail
          </Link>
        </div>
      ) : (
        <p>Seems like everything is in order here.</p>
      )}
    </section>
  )
}

export default Home
