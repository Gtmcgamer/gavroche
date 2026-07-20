import mongoose from 'mongoose'

const dailyProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityAvailable: { type: Number, required: true, min: 0, default: 5 },
  quantitySold: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['available', 'limited', 'soldout', 'coming_soon'],
    default: 'available',
  },
}, { _id: false })

const dailyMenuSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  products: [dailyProductSchema],
  notes: { type: String, default: '' },
}, { timestamps: true })

dailyMenuSchema.methods.syncStatuses = function () {
  for (const p of this.products) {
    if (p.quantityAvailable === 0) p.status = 'soldout'
    else if (p.quantityAvailable <= 3) p.status = 'limited'
    else p.status = 'available'
  }
}

export default mongoose.model('DailyMenu', dailyMenuSchema)
