import { createContext, useState, useEffect } from 'react'
import useApi from '../hooks/useApi'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // esse loading é GLOBAL
  const { request } = useApi()

  // busca dados do usuário na primeira montagem
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const data = await request(
          { url: '/sessions/me', method: 'GET' },
          false // não exibe nenhum toast para evitar confusão
        )

        if (data) {
          setUserData(data)
        }
      } catch {
        // o hook useApi() lida com os erros; não é necessário catch(error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [request])

  // busca e atualiza os dados do usuário de forma manual
  const refreshUserData = async () => {
    try {
      const response = await request({ url: '/sessions/me', method: 'GET' })
      setUserData(response)
    } catch {
      // o hook useApi() lida com os erros
      setUserData(null)
    }
  }

  return (
    <UserContext.Provider
      value={{ userData, setUserData, loading, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
