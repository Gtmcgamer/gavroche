import express from 'express'
import Product from '../models/Product.js'
import DailyMenu from '../models/DailyMenu.js'
import OrderRequest from '../models/OrderRequest.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const todayStr = () => new Date().toISOString().split('T')[0]

router.get('/overview', protect, async (req, res) => {
  try {
    const today = todayStr()
    const [todayMenu, totalProducts, pendingOrders, totalOrders] = await Promise.all([
      DailyMenu.findOne({ date: today }),
      Product.countDocuments({ isActive: true }),
      OrderRequest.countDocuments({ status: 'paid', pickupDate: today }),
      OrderRequest.countDocuments(),
    ])

    let availableToday = 0, soldOutToday = 0, limitedToday = 0
    if (todayMenu) {
      availableToday = todayMenu.products.filter((p) => p.status === 'available').length
      limitedToday = todayMenu.products.filter((p) => p.status === 'limited').length
      soldOutToday = todayMenu.products.filter((p) => p.status === 'soldout').length
    }

    res.json({
      totalProducts,
      availableToday,
      limitedToday,
      soldOutToday,
      pendingOrders,
      totalOrders,
      todayProductCount: todayMenu?.products.length || 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/products', protect, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ views: -1 })
      .limit(10)
      .select('name views requestCount category price')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
