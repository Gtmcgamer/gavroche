import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false })

const orderRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, default: '', trim: true },
  items: [orderItemSchema],
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, default: '17:00' },
  notes: { type: String, default: '' },
  discount: {
    type: { type: String, enum: ['percent', 'fixed'], default: 'fixed' },
    amount: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['paid', 'cancelled'],
    default: 'paid',
  },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true })

orderRequestSchema.pre('save', function (next) {
  const subtotal = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const disc = this.discount?.amount ?? 0
  if (this.discount?.type === 'percent') {
    this.totalAmount = Math.max(0, subtotal * (1 - disc / 100))
  } else {
    this.totalAmount = Math.max(0, subtotal - disc)
  }
  next()
})

export default mongoose.model('OrderRequest', orderRequestSchema)
