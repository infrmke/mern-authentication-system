import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { UserContext } from '../context/UserContext'

const PublicRoute = () => {
  const { userData, loading } = useContext(UserContext)

  if (loading) return <div>Loading...</div>

  return userData ? <Navigate to="/home" replace /> : <Outlet />
}

export default PublicRoute
