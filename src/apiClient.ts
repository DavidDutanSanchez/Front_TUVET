import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

if (!backendUrl) {
  throw new Error(
    'No se ha configurado VITE_BACKEND_URL en las variables de entorno'
  )
}

const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      const prefix = import.meta.env.VITE_AUTH_PREFIX || 'Bearer'

      config.headers.Authorization = `${prefix} ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
    }

    return Promise.reject(error)
  }
)

export default apiClient