import { useState, useEffect } from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'

import SpinnerLoader from '../components/loaders/SpinnerLoader'
import api from '../services/axios'

const PasswordGuardRoute = () => {
  const [isValid, setIsValid] = useState(null)

  const location = useLocation()
  const email = location.state?.email

  //  verifica se o token de redefinição de senha é válido e está ativo
  useEffect(() => {
    const checkStatus = async () => {
      if (!email) {
        setIsValid(false)
        return
      }

      try {
        await api.get('/otp/status')
        setIsValid(true)
      } catch (error) {
        setIsValid(false)

        toast.error(
          error?.response?.data['message'] || 'Something went wrong. Try again.'
        )
      }
    }

    checkStatus()
  }, [email])

  if (isValid === null) return <SpinnerLoader />

  // se o token for inválido ou o e-mail não estiver no state, redireciona
  // o usuário para a página de solicitação de redefinição de senha
  return isValid ? <Outlet /> : <Navigate to="/forgot-password" replace />
}

export default PasswordGuardRoute
