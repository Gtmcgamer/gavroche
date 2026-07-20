import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Trash, CheckCircle, Package, X, Plus, MagnifyingGlass,
  Minus, ClockCountdown, Receipt, ArrowLeft, Check,
  CaretDown, CaretUp, XCircle, ArrowsClockwise,
} from '@phosphor-icons/react'
import { getOrders, updateOrderStatus, createOrder, getAllProducts } from '../../lib/api'
import type { OrderRequest, OrderStatus, Product, ProductCategory } from '../../types'
import { ORDER_STATUS_LABELS, CATEGORY_LABELS } from '../../types'

interface CartLine {
  product: Product
  quantity: number
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
}


const CATEGORIES: (ProductCategory | 'all')[] = [
  'all', 'cheesecake', 'tiramisu', 'italian', 'chocolate', 'pistachio', 'seasonal', 'special',
]

const HISTORY_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'paid', label: 'Payées' },
  { key: 'cancelled', label: 'Annulées' },
]

export default function AdminOrders() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [todayOrders, setTodayOrders] = useState<OrderRequest[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('fixed')
  const [discountValue, setDiscountValue] = useState('')
  const [historyFilter, setHistoryFilter] = useState<OrderStatus | 'all'>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const subtotal = cart.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const discountNum = parseFloat(discountValue) || 0
  const discountAmount = discountType === 'percent'
    ? subtotal * (discountNum / 100)
    : Math.min(discountNum, subtotal)
  const total = Math.max(0, subtotal - discountAmount)
  const itemCount = cart.reduce((s, l) => s + l.quantity, 0)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getAllProducts()
      .then((res: { data: Product[] }) => setProducts(res.data.filter((p) => p.isActive)))
      .catch(console.error)
  }, [])

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await getOrders({ date: today })
      setTodayOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setHistoryLoading(false)
    }
  }, [today])

  useEffect(() => {
    if (historyOpen) fetchHistory()
  }, [historyOpen, fetchHistory])

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const ex = prev.find((l) => l.product._id === p._id)
      if (ex) return prev.map((l) => l.product._id === p._id ? { ...l, quantity: l.quantity + 1 } : l)
      return [...prev, { product: p, quantity: 1 }]
    })
  }

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) setCart((prev) => prev.filter((l) => l.product._id !== id))
    else setCart((prev) => prev.map((l) => l.product._id === id ? { ...l, quantity: qty } : l))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setSaving(true)
    try {
      const res = await createOrder({
        customerName: customerName || 'Client',
        phone: '',
        items: cart.map((l) => ({ productId: l.product._id, productName: l.product.name, quantity: l.quantity, price: l.product.price })),
        pickupDate: today,
        pickupTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        notes,
        discount: { type: discountType, amount: discountNum },
      })
      setTodayOrders((prev) => [res.data, ...prev])
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setCart([])
        setCustomerName('')
        setNotes('')
        setDiscountValue('')
        setDiscountType('fixed')
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await updateOrderStatus(id, newStatus)
      setTodayOrders((prev) => prev.map((o) => o._id === id ? res.data : o))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredOrders = todayOrders
    .filter((o) => historyFilter === 'all' || o.status === historyFilter)
    .sort((a, b) => {
      const order = { paid: 0, cancelled: 1 }
      const sd = order[a.status] ?? 2
      const sd2 = order[b.status] ?? 2
      if (sd !== sd2) return sd - sd2
      return b.createdAt.localeCompare(a.createdAt)
    })

  const todayRevenue = todayOrders
    .filter((o) => o.status === 'paid')
    .reduce((s, o) => s + o.totalAmount, 0)
  const todayCount = todayOrders.length
  const paidCount = todayOrders.filter((o) => o.status === 'paid').length
  const cancelledCount = todayOrders.filter((o) => o.status === 'cancelled').length

  const visibleProducts = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const todayPending = paidCount

  return (
    <div className="-m-6 flex-1 flex flex-col overflow-hidden bg-[#f7f4f0]">
      <div className="bg-chocolate px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold text-cream-50 leading-none">Caisse</h1>
          <p className="font-sans text-[11px] text-cream-200 mt-0.5 capitalize">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => setHistoryOpen(true)}
          className="relative flex items-center gap-2 bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 px-4 py-2 rounded-xl font-sans text-sm font-medium transition-colors"
        >
          <Receipt size={16} />
          Commandes du jour
          {todayPending > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-chocolate text-[10px] font-bold rounded-full flex items-center justify-center">
              {todayPending}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-cream-100 flex-shrink-0">
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-100" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit…"
                  className="w-full pl-8 pr-3 py-2 border border-cream-200 rounded-xl font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate bg-cream-50 transition"
                />
              </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-chocolate text-cream-50'
                      : 'bg-cream-100 text-chocolate-100 hover:bg-cream-200 hover:text-chocolate'
                  }`}
                >
                  {cat === 'all' ? 'Tout' : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 pb-24 lg:pb-4">
            {visibleProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <Package size={40} className="text-cream-200" />
                <p className="font-sans text-chocolate-100">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {visibleProducts.map((p) => {
                  const inCart = cart.find((l) => l.product._id === p._id)
                  return (
                    <motion.button
                      key={p._id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(p)}
                      className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 text-left transition-all duration-150 ${
                        inCart ? 'border-pistachio shadow-md' : 'border-transparent hover:border-cream-200 hover:shadow-md'
                      }`}
                    >
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-cover" />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-cream-100 flex items-center justify-center">
                          <span className="font-display text-3xl text-cream-200">G</span>
                        </div>
                      )}
                      {inCart && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-pistachio rounded-full flex items-center justify-center shadow">
                          <span className="font-sans text-xs font-bold text-chocolate">{inCart.quantity}</span>
                        </div>
                      )}
                      <div className="p-2.5">
                        <p className="font-sans text-xs font-bold text-chocolate line-clamp-2 leading-snug">
                          {p.name}
                        </p>
                        <p className="font-display text-sm font-bold text-chocolate mt-1">
                          {p.price} <span className="font-sans font-normal text-xs">DT</span>
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex w-80 xl:w-96 bg-white border-l border-cream-100 flex-col flex-shrink-0">
          <div className="px-5 py-4 border-b border-cream-100">
            <p className="font-sans text-[11px] font-bold text-chocolate-100 uppercase tracking-wide mb-2">
              Client (optionnel)
            </p>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nom du client…"
              className="w-full border border-cream-200 rounded-xl px-3 py-2 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition bg-cream-50"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center">
                  <Receipt size={28} className="text-cream-200" />
                </div>
                <p className="font-sans text-sm text-chocolate-100 leading-relaxed">
                  Touchez un produit pour l'ajouter à la commande
                </p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                <AnimatePresence>
                  {cart.map((line) => (
                    <motion.div
                      key={line.product._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="px-5 py-3 flex items-center gap-3"
                    >
                      {line.product.image ? (
                        <img src={line.product.image} alt={line.product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-cream-100 rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-bold text-chocolate line-clamp-1">{line.product.name}</p>
                        <p className="font-sans text-xs text-chocolate-100">{line.product.price} DT / unité</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setQty(line.product._id, line.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-red-50 hover:text-red-500 text-chocolate flex items-center justify-center transition-colors">
                          {line.quantity === 1 ? <Trash size={12} /> : <Minus size={12} weight="bold" />}
                        </button>
                        <span className="w-5 text-center font-sans font-bold text-chocolate text-sm">{line.quantity}</span>
                        <button onClick={() => setQty(line.product._id, line.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-pistachio/30 text-chocolate flex items-center justify-center transition-colors">
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>
                      <p className="font-sans text-sm font-bold text-chocolate w-16 text-right flex-shrink-0">
                        {(line.product.price * line.quantity).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-5 pb-1 pt-2 border-t border-cream-100">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Notes (allergies, personnalisation…)"
                className="w-full border border-cream-200 rounded-xl px-3 py-2 font-sans text-xs text-chocolate focus:outline-none focus:border-chocolate bg-cream-50 resize-none transition"
              />
            </div>
          )}

          <div className="px-5 pb-5 pt-3 border-t border-cream-100 flex-shrink-0">
            {cart.length > 0 && (
              <div className="mb-3 pb-3 border-b border-cream-100">
                <p className="font-sans text-[10px] font-bold text-chocolate-100 uppercase tracking-wide mb-1.5">Remise</p>
                <div className="flex gap-2">
                  <div className="flex rounded-xl overflow-hidden border border-cream-200 flex-shrink-0">
                    <button type="button" onClick={() => setDiscountType('fixed')}
                      className={`px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                        discountType === 'fixed' ? 'bg-chocolate text-cream-50' : 'bg-white text-chocolate-100 hover:bg-cream-100'
                      }`}>DT</button>
                    <button type="button" onClick={() => setDiscountType('percent')}
                      className={`px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                        discountType === 'percent' ? 'bg-chocolate text-cream-50' : 'bg-white text-chocolate-100 hover:bg-cream-100'
                      }`}>%</button>
                  </div>
                  <input
                    type="number" min="0" max={discountType === 'percent' ? 100 : undefined} step="0.5"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percent' ? '10' : '5.00'}
                    className="flex-1 border border-cream-200 rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition bg-cream-50"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <p className="font-sans text-xs text-chocolate-100">{itemCount} article{itemCount !== 1 ? 's' : ''} · Sous-total</p>
              <p className="font-sans text-sm text-chocolate-100">{subtotal.toFixed(2)} DT</p>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between mb-1">
                <p className="font-sans text-xs text-emerald-600 font-semibold">
                  Remise {discountType === 'percent' ? `${discountNum}%` : `${discountNum.toFixed(2)} DT`}
                </p>
                <p className="font-sans text-sm text-emerald-600 font-semibold">-{discountAmount.toFixed(2)} DT</p>
              </div>
            )}
            <div className="flex items-center justify-between mb-4 pt-1">
              <p className="font-sans text-xs text-chocolate-100 uppercase tracking-wide font-bold">Total</p>
              <p className="font-display text-4xl font-bold text-chocolate">
                {total.toFixed(2)} <span className="text-lg font-normal">DT</span>
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-sans font-bold text-base flex items-center justify-center gap-2"
                >
                  <Check size={20} weight="bold" />
                  Commande enregistrée !
                </motion.div>
              ) : (
                <motion.button
                  key="checkout"
                  onClick={handleCheckout}
                  disabled={saving || cart.length === 0}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-chocolate hover:bg-chocolate-200 disabled:opacity-50 text-cream-50 py-4 rounded-2xl font-sans font-bold text-base transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={20} weight="fill" />
                      Encaisser · {total.toFixed(2)} DT
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileCartOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileCartOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl lg:hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-cream-100 flex-shrink-0">
              <p className="font-sans text-sm font-bold text-chocolate-100 uppercase tracking-wide">Commande en cours</p>
              <button onClick={() => setMobileCartOpen(false)} className="text-chocolate-100 hover:text-chocolate"><X size={20} /></button>
            </div>
            <div className="px-5 py-3 border-b border-cream-100 flex-shrink-0">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nom du client (optionnel)…"
                className="w-full border border-cream-200 rounded-xl px-3 py-2 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition bg-cream-50"
              />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-cream-100">
              {cart.map((line) => (
                <div key={line.product._id} className="px-5 py-3 flex items-center gap-3">
                  {line.product.image
                    ? <img src={line.product.image} alt={line.product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                    : <div className="w-10 h-10 bg-cream-100 rounded-lg flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-bold text-chocolate line-clamp-1">{line.product.name}</p>
                    <p className="font-sans text-xs text-chocolate-100">{line.product.price} DT</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => setQty(line.product._id, line.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-red-50 hover:text-red-500 text-chocolate flex items-center justify-center transition-colors">
                      {line.quantity === 1 ? <Trash size={12} /> : <Minus size={12} weight="bold" />}
                    </button>
                    <span className="w-5 text-center font-sans font-bold text-chocolate text-sm">{line.quantity}</span>
                    <button onClick={() => setQty(line.product._id, line.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-pistachio/30 text-chocolate flex items-center justify-center transition-colors">
                      <Plus size={12} weight="bold" />
                    </button>
                  </div>
                  <p className="font-sans text-sm font-bold text-chocolate w-14 text-right flex-shrink-0">
                    {(line.product.price * line.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="px-5 pb-2 pt-2 border-t border-cream-100 flex-shrink-0">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes…"
                  className="w-full border border-cream-200 rounded-xl px-3 py-2 font-sans text-xs text-chocolate focus:outline-none focus:border-chocolate bg-cream-50 resize-none transition"
                />
              </div>
            )}
            <div className="px-5 pb-6 pt-3 border-t border-cream-100 flex-shrink-0">
              {cart.length > 0 && (
                <div className="mb-3 pb-3 border-b border-cream-100">
                  <p className="font-sans text-[10px] font-bold text-chocolate-100 uppercase tracking-wide mb-1.5">Remise</p>
                  <div className="flex gap-2">
                    <div className="flex rounded-xl overflow-hidden border border-cream-200 flex-shrink-0">
                      <button type="button" onClick={() => setDiscountType('fixed')}
                        className={`px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                          discountType === 'fixed' ? 'bg-chocolate text-cream-50' : 'bg-white text-chocolate-100 hover:bg-cream-100'
                        }`}>DT</button>
                      <button type="button" onClick={() => setDiscountType('percent')}
                        className={`px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                          discountType === 'percent' ? 'bg-chocolate text-cream-50' : 'bg-white text-chocolate-100 hover:bg-cream-100'
                        }`}>%</button>
                    </div>
                    <input
                      type="number" min="0" max={discountType === 'percent' ? 100 : undefined} step="0.5"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === 'percent' ? '10' : '5.00'}
                      className="flex-1 border border-cream-200 rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition bg-cream-50"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-1">
                <p className="font-sans text-xs text-chocolate-100">{itemCount} article{itemCount !== 1 ? 's' : ''} · Sous-total</p>
                <p className="font-sans text-sm text-chocolate-100">{subtotal.toFixed(2)} DT</p>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between mb-1">
                  <p className="font-sans text-xs text-emerald-600 font-semibold">
                    Remise {discountType === 'percent' ? `${discountNum}%` : `${discountNum.toFixed(2)} DT`}
                  </p>
                  <p className="font-sans text-sm text-emerald-600 font-semibold">-{discountAmount.toFixed(2)} DT</p>
                </div>
              )}
              <div className="flex items-center justify-between mb-4 pt-1">
                <p className="font-sans text-xs text-chocolate-100 uppercase tracking-wide font-bold">Total</p>
                <p className="font-display text-3xl font-bold text-chocolate">{total.toFixed(2)} <span className="text-base font-normal">DT</span></p>
              </div>
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="ms" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-sans font-bold text-base flex items-center justify-center gap-2">
                    <Check size={20} weight="bold" />Commande enregistrée !
                  </motion.div>
                ) : (
                  <motion.button key="mc" onClick={handleCheckout} disabled={saving || cart.length === 0} whileTap={{ scale: 0.98 }}
                    className="w-full bg-chocolate hover:bg-chocolate-200 disabled:opacity-50 text-cream-50 py-4 rounded-2xl font-sans font-bold text-base transition-colors flex items-center justify-center gap-2">
                    {saving
                      ? <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                      : <><CheckCircle size={20} weight="fill" />Encaisser · {total.toFixed(2)} DT</>}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!mobileCartOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-cream-100 px-4 py-3 flex items-center gap-3 shadow-lg"
          >
            <button
              onClick={() => setMobileCartOpen(true)}
              className="flex-1 flex items-center justify-between bg-cream-50 border border-cream-200 rounded-2xl px-4 py-3"
            >
              <span className="font-sans text-sm text-chocolate-100">
                {itemCount === 0 ? 'Panier vide' : `${itemCount} article${itemCount !== 1 ? 's' : ''}`}
              </span>
              <span className="font-display text-lg font-bold text-chocolate">{total.toFixed(2)} DT</span>
            </button>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="bs" className="bg-emerald-500 text-white px-5 py-3 rounded-2xl font-sans font-bold text-sm flex items-center gap-1.5">
                  <Check size={16} weight="bold" />OK
                </motion.div>
              ) : (
                <motion.button key="bc" onClick={handleCheckout} disabled={saving || cart.length === 0} whileTap={{ scale: 0.97 }}
                  className="bg-chocolate hover:bg-chocolate-200 disabled:opacity-40 text-cream-50 px-5 py-3 rounded-2xl font-sans font-bold text-sm transition-colors flex items-center gap-1.5 flex-shrink-0">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                    : <><CheckCircle size={16} weight="fill" />Encaisser</>}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setHistoryOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-cream-100 bg-chocolate flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setHistoryOpen(false)} className="text-cream-200 hover:text-cream-50">
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="font-display text-lg font-bold text-cream-50">Commandes du jour</h2>
                      <p className="font-sans text-xs text-cream-200 capitalize">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                  <button onClick={fetchHistory} className="text-cream-200 hover:text-cream-50 p-1.5 rounded-lg hover:bg-cream-50/10 transition" title="Actualiser">
                    <ArrowsClockwise size={18} />
                  </button>
                </div>

                {!historyLoading && todayCount > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-cream-50/10 rounded-xl px-3 py-2 text-center">
                      <p className="font-display text-xl font-bold text-cream-50">{todayCount}</p>
                      <p className="font-sans text-[10px] text-cream-200 uppercase tracking-wide">Commandes</p>
                    </div>
                    <div className="bg-cream-50/10 rounded-xl px-3 py-2 text-center">
                      <p className="font-display text-xl font-bold text-cream-50">{paidCount}</p>
                      <p className="font-sans text-[10px] text-cream-200 uppercase tracking-wide">Payées</p>
                    </div>
                    <div className="bg-cream-50/10 rounded-xl px-3 py-2 text-center">
                      <p className="font-display text-xl font-bold text-gold">{todayRevenue.toFixed(2)}</p>
                      <p className="font-sans text-[10px] text-cream-200 uppercase tracking-wide">DT Recette</p>
                    </div>
                  </div>
                )}
              </div>

              {!historyLoading && todayCount > 0 && (
                <div className="flex gap-1 px-4 py-2.5 border-b border-cream-100 flex-shrink-0 overflow-x-auto no-scrollbar">
                  {HISTORY_FILTERS.map((f) => {
                    const count = f.key === 'all' ? todayCount : todayOrders.filter((o) => o.status === f.key).length
                    return (
                      <button
                        key={f.key}
                        onClick={() => setHistoryFilter(f.key)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors ${
                          historyFilter === f.key
                            ? 'bg-chocolate text-cream-50'
                            : 'bg-cream-100 text-chocolate-100 hover:bg-cream-200'
                        }`}
                      >
                        {f.label}
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 rounded-full ${historyFilter === f.key ? 'bg-cream-50/20' : 'bg-white'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {historyLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : todayCount === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center">
                      <Package size={32} className="text-cream-200" />
                    </div>
                    <p className="font-sans text-sm text-chocolate-100">Aucune commande aujourd'hui</p>
                    <p className="font-sans text-xs text-chocolate-100/60">Les commandes encaissées apparaîtront ici</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
                    <p className="font-sans text-sm text-chocolate-100">Aucune commande dans cette catégorie</p>
                  </div>
                ) : (
                  <div className="divide-y divide-cream-100">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrder === order._id
                      const orderSubtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
                      const hasDiscount = order.discount && order.discount.amount > 0
                      return (
                        <div key={order._id} className="px-5 py-3">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                            className="w-full flex items-start justify-between gap-3 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-sans text-sm font-bold text-chocolate">{order.customerName}</p>
                                <span className={`text-[10px] font-semibold font-sans px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                                  {ORDER_STATUS_LABELS[order.status]}
                                </span>
                              </div>
                              <p className="font-sans text-[11px] text-chocolate-100 mt-0.5">
                                {order.pickupTime} · {order.items.reduce((s, i) => s + i.quantity, 0)} article{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                              </p>
                              {!isExpanded && (
                                <p className="font-sans text-xs text-chocolate-100 mt-1 line-clamp-1">
                                  {order.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-display text-lg font-bold text-chocolate">{order.totalAmount.toFixed(2)} <span className="text-xs font-normal">DT</span></p>
                              {isExpanded
                                ? <CaretUp size={14} className="text-chocolate-100 ml-auto mt-1" />
                                : <CaretDown size={14} className="text-chocolate-100 ml-auto mt-1" />}
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 pb-1 space-y-1.5">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2 bg-cream-50 rounded-lg px-3 py-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-sans text-xs font-bold text-chocolate bg-chocolate/10 rounded-md px-1.5 py-0.5 flex-shrink-0">{item.quantity}×</span>
                                        <span className="font-sans text-xs text-chocolate line-clamp-1">{item.productName}</span>
                                      </div>
                                      <span className="font-sans text-xs font-semibold text-chocolate-100 flex-shrink-0">{(item.price * item.quantity).toFixed(2)} DT</span>
                                    </div>
                                  ))}
                                  {hasDiscount && (
                                    <div className="flex items-center justify-between px-3 pt-1">
                                      <span className="font-sans text-xs text-emerald-600 font-semibold">
                                        Remise {order.discount.type === 'percent' ? `${order.discount.amount}%` : `${order.discount.amount.toFixed(2)} DT`}
                                      </span>
                                      <span className="font-sans text-xs text-emerald-600 font-semibold">-{(orderSubtotal - order.totalAmount).toFixed(2)} DT</span>
                                    </div>
                                  )}
                                  {order.notes && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-1">
                                      <p className="font-sans text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-0.5">Note</p>
                                      <p className="font-sans text-xs text-amber-800 italic">{order.notes}</p>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 py-2">
                                  {order.status === 'paid' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold font-sans px-3 py-2.5 rounded-xl transition-colors"
                                    >
                                      <XCircle size={14} />
                                      Annuler
                                    </button>
                                  )}
                                  {order.status === 'cancelled' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order._id, 'paid')}
                                      className="flex-1 flex items-center justify-center gap-1.5 bg-pistachio hover:bg-pistachio-dark text-chocolate text-xs font-semibold font-sans px-3 py-2.5 rounded-xl transition-colors"
                                    >
                                      <ArrowsClockwise size={14} />
                                      Marquer payée
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
