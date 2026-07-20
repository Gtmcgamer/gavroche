import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-chocolate flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-cream-50">Gavroche</h1>
          <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-gold mt-1">
            Tableau de bord
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="font-display text-xl font-semibold text-chocolate mb-6">
            Connexion
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-cream-200 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-chocolate-100/50 focus:outline-none focus:border-chocolate focus:ring-2 focus:ring-chocolate/10 transition"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-cream-200 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-chocolate-100/50 focus:outline-none focus:border-chocolate focus:ring-2 focus:ring-chocolate/10 transition"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-red-600 font-sans text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-chocolate hover:bg-chocolate-200 text-cream-50 py-3.5 rounded-xl font-sans font-semibold text-sm transition-colors duration-200 disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center font-sans text-xs text-cream-200 mt-6 opacity-50">
          Gavroche Admin v1.0
        </p>
      </motion.div>
    </div>
  )
}
