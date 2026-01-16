import axios from 'axios'

const PORT = import.meta.env.VITE_PORT || 3001

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://localhost:${PORT}`,
  withCredentials: true,
})

export default api
