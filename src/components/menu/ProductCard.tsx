import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Star, ChefHat } from '@phosphor-icons/react'
import type { DailyMenuItem } from '../../types'
import StatusBadge from './StatusBadge'
import { getCategoryLabel } from '../../types'

interface Props {
  item: DailyMenuItem
  index: number
  featured?: boolean
}

export default function ProductCard({ item, index, featured }: Props) {
  const { productId: product, quantityAvailable, status } = item
  const isSoldOut = status === 'soldout'
  const isFeatured = featured ?? product.isFeatured

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${isSoldOut ? 'opacity-60' : ''} ${isFeatured ? 'p-3 -m-3 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent' : ''}`}
    >
      {isFeatured && !isSoldOut && (
        <div className="absolute -top-2 left-4 z-10 flex items-center gap-1 bg-gold text-chocolate text-[9px] font-bold font-sans uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          <ChefHat size={10} weight="fill" />
          Consigliato
        </div>
      )}

      <Link to={`/product/${product._id}`} className="block">
        <div className="flex gap-4 items-start">
          {/* Thumbnail — circular, elegant with hover expand */}
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-sm ${
              isSoldOut
                ? 'border-cream-200'
                : 'border-cream-200 group-hover:border-gold group-hover:shadow-md'
            }`}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover photo-expand ${isSoldOut ? 'grayscale' : ''}`}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-cream-100 flex items-center justify-center">
                  <span className="font-display text-2xl text-cream-200">G</span>
                </div>
              )}
            </div>

            {/* Sold-out overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 rounded-full sold-out-overlay flex items-center justify-center">
                <span className="font-serif text-[9px] text-cream-50 uppercase tracking-wider rotate-[-15deg] font-semibold">
                  Esaurito
                </span>
              </div>
            )}

            {/* Featured star (if not already in a featured section) */}
            {isFeatured && !isSoldOut && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-chocolate flex items-center justify-center shadow-md">
                <Star size={10} weight="fill" className="text-gold" />
              </span>
            )}
          </div>

          {/* Content — editorial menu style */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Name + dotted leader + price */}
            <div className="flex items-baseline gap-2">
              <h3 className={`font-display text-base sm:text-lg font-semibold leading-snug transition-colors duration-300 line-clamp-1 ${
                isSoldOut ? 'text-chocolate-100' : 'text-chocolate group-hover:text-gold'
              }`}>
                {product.name}
              </h3>
              <span className="flex-1 border-b border-dotted border-chocolate-200/40 mb-1" />
              <p className={`font-display text-base sm:text-lg font-bold flex-shrink-0 ${isSoldOut ? 'text-chocolate-100 line-through' : 'text-chocolate'}`}>
                {product.price}
                <span className="text-xs font-normal text-chocolate-100 ml-0.5">DT</span>
              </p>
            </div>

            {/* Category — Italian editorial */}
            <p className="font-serif text-xs italic text-pistachio-dark mt-0.5">
              {getCategoryLabel(product.category)}
            </p>

            {/* Description */}
            <p className={`font-sans text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2 ${
              isSoldOut ? 'text-chocolate-100/60' : 'text-chocolate-50'
            }`}>
              {product.description}
            </p>

            {/* Status + quantity */}
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={status} quantity={quantityAvailable} />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
