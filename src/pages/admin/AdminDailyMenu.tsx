import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  Trash,
  ArrowCounterClockwise,
} from '@phosphor-icons/react'
import {
  getMenuByDate,
  saveDailyMenu,
  updateMenuProduct,
  removeFromMenu,
  getAllProducts,
} from '../../lib/api'
import type { DailyMenu, DailyMenuItem, Product, ProductStatus } from '../../types'
import { CATEGORY_LABELS } from '../../types'
import StatusBadge from '../../components/menu/StatusBadge'

const todayStr = () => new Date().toISOString().split('T')[0]

const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

const addDays = (dateStr: string, n: number) => {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export default function AdminDailyMenu() {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [menu, setMenu] = useState<DailyMenu | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addQty, setAddQty] = useState<Record<string, number>>({})
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const fetchMenu = useCallback(async () => {
    setLoadingMenu(true)
    try {
      const res = await getMenuByDate(selectedDate)
      setMenu(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMenu(false)
    }
  }, [selectedDate])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  useEffect(() => {
    getAllProducts()
      .then((res: { data: Product[] }) => setAllProducts(res.data))
      .catch(console.error)
  }, [])

  const menuProductIds = new Set(
    menu?.products.map((p) =>
      typeof p.productId === 'string' ? p.productId : p.productId._id
    ) ?? []
  )

  const availableToAdd = allProducts.filter((p) => {
    if (!p.isActive) return false
    if (menuProductIds.has(p._id)) return false
    if (!search) return true
    return p.name.toLowerCase().includes(search.toLowerCase())
  })

  const handleAddProduct = async (product: Product) => {
    const qty = addQty[product._id] ?? 5
    setSaving(true)
    try {
      const currentProducts = menu?.products.map((p) => ({
        productId: typeof p.productId === 'string' ? p.productId : p.productId._id,
        quantityAvailable: p.quantityAvailable,
        quantitySold: p.quantitySold,
        status: p.status,
      })) ?? []

      const newStatus: ProductStatus = qty === 0 ? 'soldout' : qty <= 3 ? 'limited' : 'available'

      const res = await saveDailyMenu({
        date: selectedDate,
        products: [
          ...currentProducts,
          { productId: product._id, quantityAvailable: qty, quantitySold: 0, status: newStatus },
        ],
        notes: menu?.notes ?? '',
      })
      setMenu(res.data)
      setAddQty((prev) => { const n = { ...prev }; delete n[product._id]; return n })
      showToast(`${product.name} ajouté au menu`)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleQtyChange = async (item: DailyMenuItem, delta: number) => {
    const productId = typeof item.productId === 'string' ? item.productId : item.productId._id
    const newQty = Math.max(0, item.quantityAvailable + delta)
    try {
      const res = await updateMenuProduct(selectedDate, productId, { quantityAvailable: newQty })
      setMenu(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusSet = async (item: DailyMenuItem, status: ProductStatus) => {
    const productId = typeof item.productId === 'string' ? item.productId : item.productId._id
    try {
      const res = await updateMenuProduct(selectedDate, productId, { status })
      setMenu(res.data)
      showToast(status === 'soldout' ? 'Marqué comme épuisé' : 'Statut restauré')
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (item: DailyMenuItem) => {
    const productId = typeof item.productId === 'string' ? item.productId : item.productId._id
    const name = typeof item.productId === 'string' ? 'Produit' : item.productId.name
    try {
      const res = await removeFromMenu(selectedDate, productId)
      setMenu(res.data)
      showToast(`${name} retiré du menu`)
    } catch (err) {
      console.error(err)
    }
  }

  const getProductName = (item: DailyMenuItem) =>
    typeof item.productId === 'string' ? 'Produit' : item.productId.name

  const getProductImage = (item: DailyMenuItem) =>
    typeof item.productId === 'string' ? '' : item.productId.image

  const getProductCategory = (item: DailyMenuItem) =>
    typeof item.productId === 'string' ? null : item.productId.category

  return (
    <div className="space-y-6 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-chocolate">Menu du Jour</h1>
          <p className="font-sans text-sm text-chocolate-100 mt-0.5 capitalize">
            {fmtDate(selectedDate)}
            {selectedDate === todayStr() && (
              <span className="ml-2 text-[11px] bg-pistachio/20 text-pistachio-dark font-semibold px-2 py-0.5 rounded-full">
                Aujourd'hui
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="p-2 rounded-xl bg-white border border-cream-200 text-chocolate hover:bg-cream-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-cream-200 rounded-xl px-4 py-2 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate bg-white transition"
          />
          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="p-2 rounded-xl bg-white border border-cream-200 text-chocolate hover:bg-cream-100 transition-colors"
          >
            <ArrowRight size={18} />
          </button>
          {selectedDate !== todayStr() && (
            <button
              onClick={() => setSelectedDate(todayStr())}
              className="px-4 py-2 rounded-xl bg-pistachio hover:bg-pistachio-dark text-chocolate font-sans text-sm font-semibold transition-colors"
            >
              Aujourd'hui
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold text-chocolate uppercase tracking-wide">
              Produits au menu
              {menu && (
                <span className="ml-2 font-normal text-chocolate-100 normal-case">
                  ({menu.products.length})
                </span>
              )}
            </h2>
          </div>

          {loadingMenu ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !menu || menu.products.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed border-cream-200">
              <p className="font-display text-xl text-chocolate mb-2">Menu vide</p>
              <p className="font-sans text-sm text-chocolate-100">
                Ajoutez des produits depuis le panneau de droite
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {menu.products.map((item) => (
                <motion.div
                  key={typeof item.productId === 'string' ? item.productId : item.productId._id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-cream-100 shadow-sm p-4"
                >
                  <div className="flex items-center gap-4">
                    {getProductImage(item) ? (
                      <img
                        src={getProductImage(item)}
                        alt={getProductName(item)}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-2xl text-cream-200">G</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-sans text-sm font-bold text-chocolate">
                          {getProductName(item)}
                        </h3>
                        <StatusBadge status={item.status} quantity={item.quantityAvailable} />
                      </div>
                      {getProductCategory(item) && (
                        <p className="font-sans text-[11px] text-pistachio-dark font-semibold uppercase tracking-wide mt-0.5">
                          {CATEGORY_LABELS[getProductCategory(item)!]}
                        </p>
                      )}
                      <p className="font-sans text-xs text-chocolate-100 mt-1">
                        {item.quantitySold} vendu{item.quantitySold > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          disabled={item.status === 'soldout'}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 text-chocolate flex items-center justify-center transition-colors disabled:opacity-30"
                        >
                          <Minus size={14} weight="bold" />
                        </button>
                        <span className="w-9 text-center font-sans font-bold text-chocolate text-sm">
                          {item.quantityAvailable}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 text-chocolate flex items-center justify-center transition-colors"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                      </div>

                      <div className="flex gap-1">
                        {item.status !== 'soldout' ? (
                          <button
                            onClick={() => handleStatusSet(item, 'soldout')}
                            className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            Épuisé
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusSet(item, 'available')}
                            className="flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          >
                            <ArrowCounterClockwise size={11} />
                            Restaurer
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(item)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-cream-100 shadow-sm h-fit sticky top-6">
          <div className="p-4 border-b border-cream-100">
            <h2 className="font-sans text-sm font-bold text-chocolate uppercase tracking-wide mb-3">
              Ajouter au menu
            </h2>
            <div className="relative">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-100"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher un produit…"
                className="w-full pl-8 pr-3 py-2 border border-cream-200 rounded-xl font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto divide-y divide-cream-100">
            {availableToAdd.length === 0 ? (
              <p className="px-4 py-8 text-center font-sans text-sm text-chocolate-100">
                {search ? 'Aucun résultat' : 'Tous les produits sont déjà au menu'}
              </p>
            ) : (
              availableToAdd.map((product) => (
                <div key={product._id} className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-cream-100 rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs font-bold text-chocolate truncate">
                        {product.name}
                      </p>
                      <p className="font-sans text-[11px] text-chocolate-100">
                        {product.price} DT
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1">
                      <button
                        onClick={() =>
                          setAddQty((q) => ({
                            ...q,
                            [product._id]: Math.max(1, (q[product._id] ?? 5) - 1),
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-cream-100 text-chocolate text-sm font-bold flex items-center justify-center hover:bg-cream-200 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-sans font-bold text-chocolate text-sm">
                        {addQty[product._id] ?? 5}
                      </span>
                      <button
                        onClick={() =>
                          setAddQty((q) => ({
                            ...q,
                            [product._id]: (q[product._id] ?? 5) + 1,
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-cream-100 text-chocolate text-sm font-bold flex items-center justify-center hover:bg-cream-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddProduct(product)}
                      disabled={saving}
                      className="flex items-center gap-1 bg-pistachio hover:bg-pistachio-dark text-chocolate text-xs font-semibold font-sans px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={13} />
                      Ajouter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-chocolate text-cream-50 font-sans text-sm font-medium px-5 py-3 rounded-full shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
