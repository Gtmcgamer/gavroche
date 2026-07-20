import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { menuCategories } from '../data/content'

export default function Menu() {
  const [activeTab, setActiveTab] = useState(0)
  const reduce = useReducedMotion()
  const active = menuCategories[activeTab]

  return (
    <section id="menu" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold mb-4">
            Notre Carte
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight">
            Les Creations
          </h2>
          <p className="text-chocolate-50 font-sans text-base mt-4 max-w-md">
            Une selection de desserts et specialites, renouvelee au fil des saisons.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {menuCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
                activeTab === i
                  ? 'bg-chocolate text-cream-50'
                  : 'bg-cream-200 text-chocolate-50 hover:bg-cream-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2"
          >
            {active.items.map((item) => (
              <div
                key={item.name}
                className="border-b border-cream-300 py-5 flex items-baseline justify-between gap-4"
              >
                <div>
                  <h3 className="font-display text-xl text-chocolate font-semibold">
                    {item.name}
                  </h3>
                  <p className="text-chocolate-50 font-sans text-sm mt-1.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
