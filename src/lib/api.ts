import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('gavroche_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      if (isAdminRoute && !window.location.pathname.endsWith('/login')) {
        localStorage.removeItem('gavroche_token')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export const getProducts = (params?: { category?: string; featured?: boolean }) =>
  api.get('/products', { params })

export const getAllProducts = (params?: { category?: string }) =>
  api.get('/products/all', { params })

export const getProduct = (id: string) => api.get(`/products/${id}`)

export const createProduct = (data: unknown) => api.post('/products', data)

export const updateProduct = (id: string, data: unknown) => api.put(`/products/${id}`, data)

export const deleteProduct = (id: string) => api.delete(`/products/${id}`)

export const trackProductRequest = (id: string) => api.post(`/products/${id}/request`)

export const getTodayMenu = () => api.get('/daily-menu/today')

export const getMenuByDate = (date: string) => api.get(`/daily-menu/${date}`)

export const saveDailyMenu = (data: unknown) => api.post('/daily-menu', data)

export const updateMenuProduct = (date: string, productId: string, data: unknown) =>
  api.patch(`/daily-menu/${date}/product/${productId}`, data)

export const removeFromMenu = (date: string, productId: string) =>
  api.delete(`/daily-menu/${date}/product/${productId}`)

export const login = (credentials: { username: string; password: string }) =>
  api.post('/auth/login', credentials)

export const getMe = () => api.get('/auth/me')

export const createOrder = (data: unknown) => api.post('/orders', data)

export const getOrders = (params?: { status?: string; date?: string }) =>
  api.get('/orders', { params })

export const updateOrderStatus = (id: string, status: string) =>
  api.patch(`/orders/${id}/status`, { status })

export const deleteOrder = (id: string) => api.delete(`/orders/${id}`)

export const getAnalyticsOverview = () => api.get('/analytics/overview')

export const getProductAnalytics = () => api.get('/analytics/products')

export default api
