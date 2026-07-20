import express from 'express'
import DailyMenu from '../models/DailyMenu.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const todayStr = () => new Date().toISOString().split('T')[0]

router.get('/today', async (req, res) => {
  try {
    const menu = await DailyMenu.findOne({ date: todayStr() }).populate('products.productId')
    res.json(menu || { date: todayStr(), products: [], notes: '' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:date', protect, async (req, res) => {
  try {
    const menu = await DailyMenu.findOne({ date: req.params.date }).populate('products.productId')
    res.json(menu || { date: req.params.date, products: [], notes: '' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const { date, products, notes } = req.body
    const menu = await DailyMenu.findOneAndUpdate(
      { date },
      { date, products, notes },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    await menu.populate('products.productId')
    res.json(menu)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.patch('/:date/product/:productId', protect, async (req, res) => {
  try {
    const { quantityAvailable, status } = req.body
    const menu = await DailyMenu.findOne({ date: req.params.date })
    if (!menu) return res.status(404).json({ message: 'Menu introuvable' })

    const item = menu.products.find(
      (p) => p.productId.toString() === req.params.productId
    )
    if (!item) return res.status(404).json({ message: 'Produit non trouvé dans le menu' })

    if (quantityAvailable !== undefined) {
      item.quantityAvailable = Math.max(0, quantityAvailable)
      if (item.quantityAvailable === 0) item.status = 'soldout'
      else if (item.quantityAvailable <= 3) item.status = 'limited'
      else item.status = 'available'
    }
    if (status) item.status = status

    await menu.save()
    await menu.populate('products.productId')
    res.json(menu)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:date/product/:productId', protect, async (req, res) => {
  try {
    const menu = await DailyMenu.findOne({ date: req.params.date })
    if (!menu) return res.status(404).json({ message: 'Menu introuvable' })
    menu.products = menu.products.filter(
      (p) => p.productId.toString() !== req.params.productId
    )
    await menu.save()
    await menu.populate('products.productId')
    res.json(menu)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
