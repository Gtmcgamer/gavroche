import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Cake, Package, CheckCircle, Clock, ArrowRight, TrendDown } from '@phosphor-icons/react'
import { getAnalyticsOverview, getOrders, getProductAnalytics } from '../../lib/api'
import type { AnalyticsOverview, OrderRequest, ProductAnalytics } from '../../types'
import { ORDER_STATUS_LABELS } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderRequest[]>([])
  const [topProducts, setTopProducts] = useState<ProductAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAnalyticsOverview(),
      getOrders({ status: 'paid' }),
      getProductAnalytics(),
    ])
      .then(([ovRes, ordRes, prodRes]) => {
        setOverview(ovRes.data)
        setRecentOrders(ordRes.data.slice(0, 5))
        setTopProducts(prodRes.data.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8 overflow-y-auto flex-1">
      <div>
        <h1 className="font-display text-2xl font-bold text-chocolate capitalize">
          Bonjour 👋
        </h1>
        <p className="font-sans text-sm text-chocolate-100 mt-0.5 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Disponibles aujourd'hui",
            value: overview?.availableToday ?? 0,
            icon: <CheckCircle size={22} weight="fill" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Quantité limitée',
            value: overview?.limitedToday ?? 0,
            icon: <TrendDown size={22} weight="fill" />,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Épuisés',
            value: overview?.soldOutToday ?? 0,
            icon: <Cake size={22} weight="fill" />,
            color: 'text-red-500',
            bg: 'bg-red-50',
          },
          {
            label: 'Commandes payées',
            value: overview?.pendingOrders ?? 0,
            icon: <Package size={22} weight="fill" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-cream-100"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="font-display text-3xl font-bold text-chocolate">{stat.value}</p>
            <p className="font-sans text-xs text-chocolate-100 mt-1 leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-100">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-cream-100">
            <h2 className="font-display text-lg font-semibold text-chocolate">
              Commandes payées
            </h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 font-sans text-xs font-semibold text-pistachio-dark hover:underline"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-cream-100">
            {recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-center font-sans text-sm text-chocolate-100">
                Aucune commande payée
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-semibold text-chocolate truncate">
                        {order.customerName}
                      </p>
                      <p className="font-sans text-xs text-chocolate-100 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock size={12} className="text-chocolate-100" />
                        <span className="font-sans text-[11px] text-chocolate-100">
                          Retrait {order.pickupDate} à {order.pickupTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`text-[11px] font-semibold font-sans px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? ''}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <p className="font-sans text-sm font-bold text-chocolate">
                        {order.totalAmount} DT
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-100">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-cream-100">
            <h2 className="font-display text-lg font-semibold text-chocolate">
              Produits les plus vus
            </h2>
            <Link
              to="/admin/products"
              className="flex items-center gap-1 font-sans text-xs font-semibold text-pistachio-dark hover:underline"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-cream-100">
            {topProducts.length === 0 ? (
              <p className="px-6 py-8 text-center font-sans text-sm text-chocolate-100">
                Aucune donnée
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p._id} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-6 font-display text-xl font-bold text-cream-200 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-chocolate truncate">
                      {p.name}
                    </p>
                    <p className="font-sans text-xs text-chocolate-100">
                      {p.views} vues · {p.requestCount} demandes
                    </p>
                  </div>
                  <span className="font-sans text-sm font-bold text-chocolate flex-shrink-0">
                    {p.price} DT
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/admin/daily', label: 'Gérer le menu du jour', desc: 'Ajoutez vos créations disponibles', color: 'bg-pistachio/20 hover:bg-pistachio/30', textColor: 'text-pistachio-dark' },
          { to: '/admin/products', label: 'Ajouter un produit', desc: 'Créez de nouvelles créations', color: 'bg-gold/20 hover:bg-gold/30', textColor: 'text-gold-dark' },
          { to: '/admin/orders', label: 'Voir les commandes', desc: `${overview?.pendingOrders ?? 0} commandes payées aujourd'hui`, color: 'bg-emerald-100 hover:bg-emerald-200', textColor: 'text-emerald-700' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`${action.color} rounded-2xl p-5 flex flex-col gap-1 transition-colors duration-200 group`}
          >
            <p className={`font-sans text-sm font-bold ${action.textColor}`}>{action.label}</p>
            <p className="font-sans text-xs text-chocolate-100">{action.desc}</p>
            <ArrowRight size={16} className={`mt-2 ${action.textColor} group-hover:translate-x-1 transition-transform`} />
          </Link>
        ))}
      </div>
    </div>
  )
}
