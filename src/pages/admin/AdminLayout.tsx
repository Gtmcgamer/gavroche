import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChartBar,
  CalendarBlank,
  Cake,
  Package,
  QrCode,
  SignOut,
  List,
  X,
  ArrowSquareOut,
} from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', icon: <ChartBar size={20} />, label: 'Tableau de bord', end: true },
  { to: '/admin/daily', icon: <CalendarBlank size={20} />, label: 'Menu du Jour' },
  { to: '/admin/products', icon: <Cake size={20} />, label: 'Produits' },
  { to: '/admin/orders', icon: <Package size={20} />, label: 'Commandes' },
  { to: '/admin/qr', icon: <QrCode size={20} />, label: 'QR Code Menu' },
]

export default function AdminLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true })
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`flex flex-col h-full bg-chocolate ${
        mobile ? 'w-64' : 'w-64'
      }`}
    >
      <div className="px-6 py-5 border-b border-cream-50/10">
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold text-cream-50">Gavroche</span>
          <span className="font-serif text-[9px] tracking-[0.22em] uppercase text-gold mt-0.5">
            Admin Dashboard
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-gold/20 text-gold'
                  : 'text-cream-200 hover:bg-cream-50/10 hover:text-cream-50'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-cream-50/10 space-y-1">
        <a
          href="/menu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium text-cream-200 hover:bg-cream-50/10 hover:text-cream-50 transition-colors"
        >
          <ArrowSquareOut size={18} />
          Voir le menu client
        </a>
        <div className="px-4 py-2">
          <p className="font-sans text-xs text-cream-300 mb-0.5">Connecté en tant que</p>
          <p className="font-sans text-sm font-semibold text-cream-50">{user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <SignOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-cream-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-cream-100 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-chocolate-100 hover:text-chocolate"
          >
            <List size={24} />
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-hidden p-6 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
