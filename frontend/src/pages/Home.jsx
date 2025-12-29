import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import useTitle from '../hooks/useTitle'
import api from '../services/axios'

const Home = () => {
  useTitle('Home')

  const { userData, setUserData } = useContext(UserContext)

  const handleClickDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
      )
    ) {
      return
    }

    try {
      await api.delete(`/users/${userData.id}`)
      toast.success('Account deleted successfully.', {
        duration: 6000,
      })
      setUserData(null)
    } catch (error) {
      toast.error(
        error.response?.data['message'] ||
          "Something didn't work. Try again later."
      )
    }
  }

  return (
    <section className="user">
      {!userData?.isAccountVerified ? (
        <>
          <div className="user__heading">
            <h1>Welcome, {userData?.name.split(' ')[0] || 'user'}</h1>
            <h2>Wait a minute...</h2>
            <p>
              Could you verify your e-mail? It's just going to take you one
              minute. After that, you'll be free to delete your account.
            </p>
          </div>

          <div className="user__actions">
            <Link to="/verify-email" className="btn btn--outline">
              Verify e-mail
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="user__heading">
            <h1>Hi, {userData?.name.split(' ')[0] || 'user'}</h1>
            <h2>Looking good!</h2>
            <p>
              Seems like everything is in order here. You can now delete your
              account if you'd like.
            </p>
          </div>

          <div className="user__actions">
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleClickDelete}
            >
              Delete account
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default Home
