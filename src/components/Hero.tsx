import { motion, useReducedMotion } from 'motion/react'
import { images, brand } from '../data/content'

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative min-h-[100dvh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={images.heroTiramisu}
          alt="Tiramisu italien garni de figues fraiches et pistaches"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate-400/95 via-chocolate-300/55 to-chocolate-300/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate-400/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-20 lg:pb-28 pt-24 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cream-200 font-sans text-xs sm:text-sm uppercase tracking-[0.22em] mb-6"
          >
            Patisserie Italienne Artisanale
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream-50 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance"
          >
            L'Art de la Patisserie Italienne
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-cream-200 font-serif text-xl md:text-2xl mt-6 max-w-xl leading-relaxed"
          >
            Des creations artisanales raffinees, preparees avec passion et des ingredients d'exception.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <a
              href="#creations"
              className="inline-flex items-center justify-center gap-2 bg-cream-50 text-chocolate px-7 py-3.5 rounded-full font-sans text-base font-semibold hover:bg-cream transition-colors duration-300 active:scale-[0.98]"
            >
              Decouvrir nos creations
            </a>
            <a
              href={brand.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cream-200/40 text-cream-50 px-7 py-3.5 rounded-full font-sans text-base font-semibold hover:bg-cream-50/10 transition-colors duration-300 active:scale-[0.98]"
            >
              Commander maintenant
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
