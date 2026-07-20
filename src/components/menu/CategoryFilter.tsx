import { motion } from 'motion/react'
import type { ProductCategory } from '../../types'
import { getCategoryLabel } from '../../types'

interface Props {
  categories: ProductCategory[]
  active: ProductCategory | 'all'
  onChange: (cat: ProductCategory | 'all') => void
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  const all = ['all', ...categories] as (ProductCategory | 'all')[]

  return (
    <div className="sticky top-16 z-20 bg-cream-50/90 backdrop-blur-md -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 border-y border-cream-200/60">
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 no-scrollbar">
        {all.map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className="relative px-5 py-2 font-serif text-base transition-all duration-300 focus:outline-none group"
            >
              {isActive && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 bg-chocolate rounded-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isActive
                    ? 'text-cream-50 font-medium'
                    : 'text-chocolate-100 hover:text-chocolate'
                }`}
              >
                {cat === 'all' ? 'Tutto' : getCategoryLabel(cat as string)}
              </span>
              {isActive && (
                <motion.span
                  layoutId="cat-underline"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-px bg-gold"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
