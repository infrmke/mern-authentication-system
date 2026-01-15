import { useState, useEffect } from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import SpinnerLoader from '../components/loaders/SpinnerLoader'
import useApi from '../hooks/useApi'

const PasswordGuardRoute = () => {
  const [isValid, setIsValid] = useState(null)
  const { request } = useApi()

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
        const data = await request({
          url: '/otps/password-reset/status',
          method: 'GET',
        })

        if (data && data.active) {
          setIsValid(true)
        } else {
          setIsValid(false)
        }
      } catch {
        // o hook useApi() lida com os erros; não é necessário catch(error)
        setIsValid(false)
      }
    }

    checkStatus()
  }, [email, request])

  if (isValid === null) return <SpinnerLoader />

  // se o token for inválido ou o e-mail não estiver no state, redireciona
  // o usuário para a página de solicitação de redefinição de senha
  return isValid ? <Outlet /> : <Navigate to="/forgot-password" replace />
}

export default PasswordGuardRoute
