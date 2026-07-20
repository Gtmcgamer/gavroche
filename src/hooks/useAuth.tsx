import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin, getMe } from '../lib/api'
import type { AuthUser } from '../types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gavroche_token')
    if (token) {
      getMe()
        .then((res: { data: { user: AuthUser } }) => setUser(res.data.user))
        .catch(() => localStorage.removeItem('gavroche_token'))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const res = await apiLogin({ username, password })
    localStorage.setItem('gavroche_token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('gavroche_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
