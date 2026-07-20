import express from 'express'
import OrderRequest from '../models/OrderRequest.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const order = await OrderRequest.create(req.body)
    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { requestCount: 1 } })
      }
    }
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/', protect, async (req, res) => {
  try {
    const { status, date } = req.query
    const filter = {}
    if (status && status !== 'all') filter.status = status
    if (date) filter.pickupDate = date
    const orders = await OrderRequest.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const order = await OrderRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    await OrderRequest.findByIdAndDelete(req.params.id)
    res.json({ message: 'Commande supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
