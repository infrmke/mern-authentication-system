import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/axios'

const useApi = () => {
  const [loading, setLoading] = useState(false)

  const request = useCallback(async (config, showToast = true) => {
    setLoading(true)

    try {
      const response = await api(config)
      return response.data
    } catch (error) {
      if (showToast) {
        const message =
          error.response?.data?.message || "Something didn't work. Try again!"
        toast.error(message)
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { request, loading }
}

export default useApi
