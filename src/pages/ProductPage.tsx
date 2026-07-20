import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Tag } from '@phosphor-icons/react'
import { getProduct, getTodayMenu } from '../lib/api'
import type { Product, DailyMenuItem } from '../types'
import { getCategoryLabel } from '../types'
import StatusBadge from '../components/menu/StatusBadge'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [menuItem, setMenuItem] = useState<DailyMenuItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getProduct(id), getTodayMenu()])
      .then(([prodRes, menuRes]) => {
        setProduct(prodRes.data)
        const found = menuRes.data.products?.find(
          (p: DailyMenuItem) => p.productId._id === id || (p.productId as unknown as string) === id
        )
        setMenuItem(found || null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-chocolate">Produit introuvable</p>
        <Link to="/menu" className="text-pistachio-dark font-semibold hover:underline">
          ← Retour au menu
        </Link>
      </div>
    )
  }

  const status = menuItem?.status ?? 'coming_soon'

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-chocolate sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center gap-4">
          <Link
            to="/menu"
            className="flex items-center gap-2 text-cream-200 hover:text-cream-50 transition-colors text-sm font-sans"
          >
            <ArrowLeft size={16} />
            Menu du jour
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-cream-100 rounded-3xl flex items-center justify-center">
                <span className="font-display text-6xl text-cream-200">G</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <StatusBadge status={status} quantity={menuItem?.quantityAvailable} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-pistachio-dark font-semibold mb-3">
              {getCategoryLabel(product.category)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-chocolate leading-tight">
              {product.name}
            </h1>
            <p className="font-serif text-chocolate-50 text-lg mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-1.5 text-chocolate-100 text-sm font-sans">
                <Tag size={16} />
                {getCategoryLabel(product.category)}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-cream-200">
              <p className="font-display text-3xl font-bold text-chocolate">
                {product.price} <span className="text-lg font-normal">DT</span>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
