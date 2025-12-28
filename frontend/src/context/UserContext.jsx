import { createContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import api from '../services/axios'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // busca dados do usuário na primeira montagem
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get('/auth/status')

        if (response.data) {
          setUserData(response.data)
        }
      } catch (error) {
        setUserData(null)

        if (
          error.response?.data['status'] !== 401 &&
          error.response?.data['status'] !== 403
        ) {
          toast.error(
            'There was a server connection error. Please try again later.',
            { duration: 6000 }
          )
        }
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  // realiza a busca de dados do usuário (manual)
  const refreshUserData = async () => {
    try {
      const response = await api.get('/auth/status')
      setUserData(response.data)
    } catch (error) {
      toast.error(
        error?.response?.data['message'] || 'Something went wrong. Try again.'
      )
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
