import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis' })
    }
    const user = await User.findOne({ username })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }
    res.json({
      token: signToken(user._id),
      user: { id: user._id, username: user.username, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', protect, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, role: req.user.role } })
})

export default router
