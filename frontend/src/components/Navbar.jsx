import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { ChevronDown } from 'lucide-react'

import { UserContext } from '../context/UserContext'
import api from '../services/axios'

const Navbar = () => {
  const { userData, setUserData } = useContext(UserContext)
  const navigate = useNavigate()

  const handleClickLogOut = async () => {
    try {
      await api.post('/auth/logout')
      setUserData(null)
      navigate('/')
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || "Something didn't work. Try again."
      )
    }
  }

  return (
    <nav className="nav">
      <Link to="/home" className="nav__logo">
        auth
      </Link>

      <ul className="menu">
        <li className="menu__user">
          <p className="user__avatar">{userData?.name[0].toUpperCase()}</p>
          <p>{userData?.name.split(' ')[0]}</p>

          <span className="menu__icon">
            <ChevronDown color="hsl(220, 10%, 46%)" />
          </span>
        </li>

        <li className="menu__item" onClick={handleClickLogOut}>
          Log out
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
