import express from 'express'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category
    if (featured === 'true') filter.isFeatured = true
    const products = await Product.find(filter).sort({ isFeatured: -1, createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/all', protect, async (req, res) => {
  try {
    const { category } = req.query
    const filter = {}
    if (category) filter.category = category
    const products = await Product.find(filter).sort({ isFeatured: -1, createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json({ message: 'Produit supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/:id/request', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { $inc: { requestCount: 1 } })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
