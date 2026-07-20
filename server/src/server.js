import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import dailyMenuRoutes from './routes/dailyMenu.js'
import orderRoutes from './routes/orders.js'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/daily-menu', dailyMenuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Erreur interne du serveur' })
})

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gavroche'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté')
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB:', err.message)
    process.exit(1)
  })
