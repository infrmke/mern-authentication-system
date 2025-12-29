import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { UserContext } from '../context/UserContext'
import PulseLoader from '../components/loaders/PulseLoader'

const PublicRoute = () => {
  const { userData, loading } = useContext(UserContext)

  if (loading) return <PulseLoader />

  return userData ? <Navigate to="/home" replace /> : <Outlet />
}

export default PublicRoute
