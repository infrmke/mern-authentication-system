import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/axios'

const useApi = () => {
  const [loading, setLoading] = useState(false)

  const request = useCallback(
    async (config, showToast = true, customMessage) => {
      setLoading(true)

      try {
        const response = await api(config)
        return response.data
      } catch (error) {
        if (showToast) {
          const errorMessage =
            error.response?.data?.message ||
            customMessage ||
            "Something didn't work. Try again!"

          toast.error(errorMessage)
        }
        throw error
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { request, loading }
}

export default useApi
