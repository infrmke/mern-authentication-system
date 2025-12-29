import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { UserContext } from '../context/UserContext'
import SpinnerLoader from '../components/loaders/SpinnerLoader'

const VerificationRoute = () => {
  const { userData, loading } = useContext(UserContext)

  if (loading) return <SpinnerLoader />

  if (!userData) {
    return <Navigate to="/" replace />
  }

  if (userData.isAccountVerified) {
    return <Navigate to="/home" replace />
  }

  //  exibe a página de verificação
  return <Outlet />
}

export default VerificationRoute
