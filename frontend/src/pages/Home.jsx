import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import useTitle from '../hooks/useTitle'
import useApi from '../hooks/useApi'
import UserSection from '../components/UserSection'

const Home = () => {
  useTitle('Home')
  const { userData, setUserData } = useContext(UserContext)
  const { request } = useApi()

  // confirma se o usuário quer deletar a conta e então a deleta
  const handleClickDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
      )
    ) {
      return
    }

    try {
      await request({
        url: `/users/${userData.id}`,
        method: 'DELETE',
      })

      toast.success('Account deleted successfully.', {
        duration: 6000,
      })
      setUserData(null)
    } catch {
      // o hook useApi() lida com os erros; não é necessário catch(error)
    }
  }

  const firstName = userData?.name.split(' ')[0] || 'User'
  const isVerified = userData?.isAccountVerified

  return (
    <main className="user fade-in">
      {!isVerified ? (
        <UserSection
          title={`Welcome, ${firstName}`}
          subtitle="It's an honor, but..."
          description="Could you verify your e-mail? It's just going to take you one minute. After that, you'll be free to delete your account."
        >
          <Link
            to="/verify-email"
            className="btn btn--outline"
            aria-label="Click to verify your email address"
          >
            Verify e-mail
          </Link>
        </UserSection>
      ) : (
        <UserSection
          title={`Hi, ${firstName}`}
          subtitle="Looking good!"
          description="Seems like everything is in order here. You can now delete your account if you'd like. More features will only be added in the future..."
        >
          <button
            type="button"
            className="btn btn--danger"
            title="Warning: this action cannot be undone"
            onClick={handleClickDelete}
          >
            Delete account
          </button>
        </UserSection>
      )}
    </main>
  )
}

export default Home
