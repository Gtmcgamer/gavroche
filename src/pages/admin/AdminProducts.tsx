import { useState, useEffect, FormEvent, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  Star,
  Eye,
  Link,
  UploadSimple,
  X,
} from '@phosphor-icons/react'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../lib/api'
import type { Product } from '../../types'
import { getCategoryLabel } from '../../types'

type FormData = {
  name: string
  description: string
  category: string
  price: string
  image: string
  isFeatured: boolean
  isActive: boolean
}

const DEFAULT_FORM: FormData = {
  name: '',
  description: '',
  category: '',
  price: '',
  image: '',
  isFeatured: false,
  isActive: true,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url')
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [isNewCategory, setIsNewCategory] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts()
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const knownCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...DEFAULT_FORM, category: knownCategories[0] ?? '' })
    setFormError('')
    setImageMode('url')
    setIsNewCategory(false)
    setNewCategoryInput('')
    setFormOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p._id)
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: String(p.price),
      image: p.image,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    })
    setFormError('')
    setImageMode(p.image.startsWith('data:') ? 'file' : 'url')
    setIsNewCategory(false)
    setNewCategoryInput('')
    setFormOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.price) {
      setFormError('Nom, description et prix sont requis.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      }
      if (editingId) {
        const res = await updateProduct(editingId, payload)
        setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)))
      } else {
        const res = await createProduct(payload)
        setProducts((prev) => [res.data, ...prev])
      }
      setFormOpen(false)
    } catch (err) {
      setFormError('Erreur lors de la sauvegarde.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setConfirmDelete(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, image: ev.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-chocolate">Produits</h1>
          <p className="font-sans text-sm text-chocolate-100 mt-0.5">
            {products.length} produit{products.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-chocolate hover:bg-chocolate-200 text-cream-50 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-colors"
        >
          <Plus size={18} weight="bold" />
          Nouveau produit
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-100" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="pl-9 pr-4 py-2 bg-white border border-cream-200 rounded-xl font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate w-52 transition"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-cream-200 rounded-xl px-4 py-2 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
        >
          <option value="all">Toutes catégories</option>
          {knownCategories.map((c) => (
            <option key={c} value={c}>{getCategoryLabel(c)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-pistachio border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-100">
          <p className="font-sans text-chocolate-100">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border border-cream-100 shadow-sm overflow-hidden ${!p.isActive ? 'opacity-50' : ''}`}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-cream-100 flex items-center justify-center">
                    <span className="font-display text-3xl text-cream-200">G</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-sans text-[11px] uppercase tracking-wide text-pistachio-dark font-semibold">
                      {getCategoryLabel(p.category)}
                    </p>
                    <div className="flex items-center gap-2">
                      {p.isFeatured && (
                        <Star size={14} weight="fill" className="text-gold" />
                      )}
                      {!p.isActive && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-sans font-medium px-2 py-0.5 rounded-full">
                          Masqué
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-base font-semibold text-chocolate leading-snug line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="font-sans text-xs text-chocolate-100 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-100">
                    <p className="font-display text-lg font-bold text-chocolate">
                      {p.price} DT
                    </p>
                    <div className="flex items-center gap-1.5 text-chocolate-100 text-xs font-sans">
                      <Eye size={13} />
                      {p.views}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-cream-100 hover:bg-cream-200 text-chocolate text-xs font-semibold font-sans py-2 rounded-xl transition-colors"
                    >
                      <PencilSimple size={13} />
                      Modifier
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p._id)}
                      className="flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-cream-100">
                <h2 className="font-display text-xl font-bold text-chocolate">
                  {editingId ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-chocolate-100 hover:text-chocolate p-1"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                      Nom *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
                      placeholder="Cheesecake Pistache"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition resize-none"
                      rows={3}
                      placeholder="Description savoureuse…"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                      Catégorie
                    </label>
                    {isNewCategory ? (
                      <div className="flex gap-2">
                        <input
                          value={newCategoryInput}
                          onChange={(e) => {
                            setNewCategoryInput(e.target.value)
                            setForm((f) => ({ ...f, category: e.target.value }))
                          }}
                          placeholder="Nom de la catégorie…"
                          className="flex-1 border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
                          autoFocus
                        />
                        <button type="button" onClick={() => { setIsNewCategory(false); setForm((f) => ({ ...f, category: knownCategories[0] ?? '' })) }}
                          className="p-2.5 rounded-xl border border-cream-200 text-chocolate-100 hover:text-chocolate transition">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={form.category}
                        onChange={(e) => {
                          if (e.target.value === '__new__') { setIsNewCategory(true); setForm((f) => ({ ...f, category: '' })) }
                          else setForm((f) => ({ ...f, category: e.target.value }))
                        }}
                        className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
                      >
                        {knownCategories.map((c) => (
                          <option key={c} value={c}>{getCategoryLabel(c)}</option>
                        ))}
                        <option value="__new__">+ Nouvelle catégorie…</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                      Prix (DT) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
                      placeholder="18"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-sans text-xs font-semibold text-chocolate-100 uppercase tracking-wide mb-1.5">
                      Photo
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setImageMode('url')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-colors ${
                          imageMode === 'url' ? 'bg-chocolate text-cream-50' : 'bg-cream-100 text-chocolate-100 hover:bg-cream-200'
                        }`}>
                        <Link size={13} />Lien URL
                      </button>
                      <button type="button" onClick={() => setImageMode('file')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-colors ${
                          imageMode === 'file' ? 'bg-chocolate text-cream-50' : 'bg-cream-100 text-chocolate-100 hover:bg-cream-200'
                        }`}>
                        <UploadSimple size={13} />Fichier local
                      </button>
                    </div>
                    {imageMode === 'url' ? (
                      <input
                        value={form.image.startsWith('data:') ? '' : form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition"
                        placeholder="https://…"
                      />
                    ) : (
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-cream-200 rounded-xl p-4 text-center cursor-pointer hover:border-chocolate transition-colors"
                      >
                        {form.image && form.image.startsWith('data:') ? (
                          <div className="relative">
                            <img src={form.image} alt="preview" className="h-28 mx-auto object-contain rounded-lg" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image: '' })) }}
                              className="absolute top-0 right-0 bg-white rounded-full p-0.5 shadow text-red-400 hover:text-red-600">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-chocolate-100">
                            <UploadSimple size={24} />
                            <p className="font-sans text-xs">Cliquez pour choisir une image</p>
                          </div>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </div>
                    )}
                    {form.image && !form.image.startsWith('data:') && imageMode === 'url' && (
                      <img src={form.image} alt="preview" className="mt-2 h-20 rounded-xl object-cover w-full" onError={(e) => (e.currentTarget.style.display='none')} />
                    )}
                  </div>
                  <div className="col-span-2 flex gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                        className="w-4 h-4 rounded accent-gold"
                      />
                      <span className="font-sans text-sm text-chocolate">Produit vedette</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded accent-pistachio"
                      />
                      <span className="font-sans text-sm text-chocolate">Actif (visible)</span>
                    </label>
                  </div>
                </div>

                {formError && (
                  <p className="text-sm text-red-500 font-sans">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 bg-cream-100 hover:bg-cream-200 text-chocolate py-3 rounded-xl font-sans font-semibold text-sm transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-chocolate hover:bg-chocolate-200 text-cream-50 py-3 rounded-xl font-sans font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Sauvegarde…' : editingId ? 'Sauvegarder' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-bold text-chocolate mb-2">
                Supprimer ce produit ?
              </h3>
              <p className="font-sans text-sm text-chocolate-100 mb-6">
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-cream-100 text-chocolate py-2.5 rounded-xl font-sans font-semibold text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-sans font-semibold text-sm transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
