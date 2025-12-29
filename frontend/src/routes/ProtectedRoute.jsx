import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { UserContext } from '../context/UserContext'

const ProtectedRoute = () => {
  const { userData, loading } = useContext(UserContext)

  if (loading) return <div>Loading...</div>

  return userData ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
