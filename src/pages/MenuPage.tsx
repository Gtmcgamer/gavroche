import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { ArrowLeft, Warning, Clock, Sparkle, ChefHat } from '@phosphor-icons/react'
import { getTodayMenu } from '../lib/api'
import type { DailyMenu, DailyMenuItem, ProductCategory } from '../types'
import { getCategoryLabel } from '../types'
import StatusBadge from '../components/menu/StatusBadge'
import CategoryFilter from '../components/menu/CategoryFilter'
import ProductCard from '../components/menu/ProductCard'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

function MenuSection({ cat, items, index }: { cat: ProductCategory; items: DailyMenuItem[]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Section header with Roman numeral */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-display text-3xl font-bold text-gold/40 leading-none">
          {ROMAN[index] ?? index + 1}
        </span>
        <div className="flex-1 ornament-divider">
          <h2 className="font-display text-2xl text-chocolate font-bold px-4 whitespace-nowrap">
            {getCategoryLabel(cat)}
          </h2>
        </div>
      </div>

      {/* Items in 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        {items.map((item, i) => (
          <ProductCard key={item.productId._id} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  )
}

export default function MenuPage() {
  const [menu, setMenu] = useState<DailyMenu | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')

  const fetchMenu = useCallback(async () => {
    try {
      const res = await getTodayMenu()
      setMenu(res.data)
      setError('')
    } catch {
      setError('Impossible de charger le menu. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenu()
    const interval = setInterval(fetchMenu, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchMenu])

  const products: DailyMenuItem[] = menu?.products ?? []

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.productId.category === activeCategory)

  const categories = [
    ...new Set(products.map((p) => p.productId.category)),
  ] as ProductCategory[]

  const availableCount = products.filter((p) => p.status !== 'soldout').length
  const soldOutCount = products.filter((p) => p.status === 'soldout').length
  const almostGone = products.filter(
    (p) => p.status === 'limited' && p.quantityAvailable <= 2
  )

  // Featured products (isFeatured + not sold out)
  const featuredProducts = products.filter((p) => p.productId.isFeatured && p.status !== 'soldout')

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Group products by category for menu-style display
  const groupedProducts = filteredProducts.reduce((acc, item) => {
    const cat = item.productId.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, DailyMenuItem[]>)

  return (
    <div className="min-h-screen menu-paper">
      {/* Header — slim, elegant */}
      <header className="bg-chocolate sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-cream-200 hover:text-cream-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-cream-50">Gavroche</span>
              <span className="font-serif text-[9px] tracking-[0.22em] uppercase text-gold">
                Patisserie Italienne
              </span>
            </div>
          </Link>
          <span className="hidden sm:block font-sans text-xs text-cream-200 capitalize">
            {today}
          </span>
        </div>
      </header>

      {/* Menu Hero — editorial, Italian */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate via-chocolate-200 to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, #C9A24D 0%, transparent 40%), radial-gradient(circle at 70% 50%, #A8B87A 0%, transparent 40%)`,
          }}
        />
        <div className="relative max-w-[900px] mx-auto px-6 lg:px-10 pt-16 pb-12 text-center">
          {/* Wax seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full wax-seal mb-6"
          >
            <span className="font-display text-2xl font-bold text-chocolate/80">G</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ornament-divider mb-4"
          >
            <span className="font-serif text-gold text-lg italic tracking-wider">Benvenuti alla Gavroche</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-5xl md:text-6xl text-cream-50 font-bold leading-tight text-shadow-soft"
          >
            La Carta del Giorno
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-serif text-cream-200 text-xl md:text-2xl italic mt-4 leading-relaxed max-w-lg mx-auto"
          >
            "Ogni dolce racconta una storia di passione e tradizione"
          </motion.p>

          {/* Date + availability */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 text-cream-200">
              <Clock size={14} className="text-gold" />
              <span className="font-sans text-xs uppercase tracking-wider capitalize">{today}</span>
            </div>
            {!loading && !error && products.length > 0 && (
              <>
                <span className="w-px h-4 bg-cream-300/30" />
                <div className="flex items-center gap-2 text-cream-200">
                  <Sparkle size={14} className="text-gold" />
                  <span className="font-sans text-xs uppercase tracking-wider">
                    {availableCount} créazioni disponibili
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Menu Body */}
      <main className="max-w-[900px] mx-auto px-6 lg:px-10 pb-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-base italic text-chocolate-100">Caricamento…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Warning size={40} className="text-amber-500" />
            <p className="font-sans text-base text-chocolate-50 max-w-sm">{error}</p>
            <button
              onClick={fetchMenu}
              className="font-sans text-sm font-semibold text-pistachio-dark underline"
            >
              Riprova
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Almost gone alert */}
            {almostGone.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-amber-50/80 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-600 text-base">⚡</span>
                  <p className="font-serif text-sm font-semibold text-amber-800 uppercase tracking-wide italic">
                    Ultimi pezzi — Affrettatevi
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {almostGone.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-amber-100"
                    >
                      {item.productId.image && (
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-sans text-xs font-semibold text-chocolate line-clamp-1">
                          {item.productId.name}
                        </p>
                        <StatusBadge status="limited" quantity={item.quantityAvailable} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Featured section — Chef's recommendations */}
            {activeCategory === 'all' && featuredProducts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 relative menu-frame rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-gold/5 via-cream-50/50 to-transparent"
              >
                <div className="menu-corner menu-corner-tl" />
                <div className="menu-corner menu-corner-tr" />
                <div className="menu-corner menu-corner-bl" />
                <div className="menu-corner menu-corner-br" />

                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-gold mb-2">
                    <ChefHat size={20} weight="fill" />
                    <span className="font-serif text-sm italic tracking-wider uppercase">Le Consigliazioni dello Chef</span>
                    <ChefHat size={20} weight="fill" />
                  </div>
                  <p className="font-sans text-xs text-chocolate-100">
                    Les créations signature de Gavroche — sélectionnées avec passion
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {featuredProducts.map((item, i) => (
                    <ProductCard key={item.productId._id} item={item} index={i} featured />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Category filter */}
            {categories.length > 1 && (
              <div className="mb-10">
                <CategoryFilter
                  categories={categories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="ornament-divider mb-4">
                  <span className="font-serif text-chocolate-100 italic">Torneremo presto</span>
                </div>
                <p className="font-display text-3xl text-chocolate mb-3">
                  Revenez bientôt
                </p>
                <p className="font-sans text-chocolate-100 text-base max-w-md mx-auto leading-relaxed">
                  La sélection du jour est en cours de préparation. Repassez plus tard
                  pour découvrir nos créations du moment.
                </p>
              </div>
            ) : activeCategory === 'all' && categories.length > 1 ? (
              /* Grouped by category — true menu layout */
              <div className="space-y-14">
                {categories.map((cat, catIndex) => {
                  const catItems = groupedProducts[cat] || []
                  if (catItems.length === 0) return null
                  return (
                    <MenuSection key={cat} cat={cat} items={catItems} index={catIndex} />
                  )
                })}
              </div>
            ) : (
              /* Single category — still 2-column */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <AnimatePresence>
                  {filteredProducts.map((item, i) => (
                    <ProductCard key={item.productId._id} item={item} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Footer — Italian sign-off */}
            <div className="mt-16 pt-8 border-t border-cream-200 text-center space-y-3">
              <div className="ornament-divider">
                <span className="font-serif text-chocolate-100 italic text-sm">Grazie mille · À bientôt</span>
              </div>
              <p className="font-sans text-xs text-chocolate-100 uppercase tracking-wide">
                Fatto con amore · Mise à jour automatique toutes les 5 minutes
              </p>
              {soldOutCount > 0 && (
                <p className="font-serif text-xs italic text-chocolate-100/60">
                  {soldOutCount} création{soldOutCount !== 1 ? 's' : ''} épuisée{soldOutCount !== 1 ? 's' : ''} aujourd'hui
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
