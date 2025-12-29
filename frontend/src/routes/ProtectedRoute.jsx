import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { UserContext } from '../context/UserContext'
import SpinnerLoader from '../components/loaders/SpinnerLoader'

const ProtectedRoute = () => {
  const { userData, loading } = useContext(UserContext)

  if (loading) return <SpinnerLoader />

  return userData ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
