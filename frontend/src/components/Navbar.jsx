import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import toast from 'react-hot-toast'

import { ChevronDown } from 'lucide-react'
import Logo from '../assets/images/logoipsum_light.png'

import { UserContext } from '../context/UserContext'
import api from '../services/axios'

const Navbar = () => {
  const { userData, setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const handleClickLogOut = async () => {
    try {
      await api.post('/sessions/logout')
      setUserData(null)
      navigate('/')
    } catch (error) {
      toast.error(error?.response?.data['message'] || "Something didn't work. Try again.")
    }
  }

  const firstName = userData?.name.split(' ')[0] || 'User'
  const firstNameLetter = firstName[0].toUpperCase()

  return (
    <nav className="nav" role="navigation" aria-label="Main Navigation">
      <Link to="/home" className="nav__logo" aria-label="Go to Home Page">
        <img src={Logo} alt="Logo Ipsum Network" />
      </Link>

      <ul className="menu" role="menubar">
        <li
          className="menu__user"
          role="menuitem"
          tabIndex="0"
          aria-haspopup="true"
          aria-label={`User profile: ${firstName}`}
        >
          <p className="menu__avatar" aria-hidden="true">
            {firstNameLetter}
          </p>
          <p>{firstName}</p>

          <span className="menu__icon" aria-hidden="true">
            <ChevronDown color="hsl(220, 10%, 46%)" />
          </span>
        </li>

        <li
          className="menu__item"
          role="menuitem"
          tabIndex="0"
          onClick={handleClickLogOut}
          onKeyDown={(e) => e.key === 'Enter' && handleClickLogOut()}
        >
          Log out
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
