import axios from 'axios'

axios.defaults.withCredentials = true

const api = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
})

export default api
