import { motion, useReducedMotion } from 'motion/react'
import { images } from '../data/content'

export default function About() {
  const reduce = useReducedMotion()

  return (
    <section id="savoir-faire" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl order-1"
          >
            <img
              src={images.shopInterior}
              alt="Interieur de la boutique Gavroche avec patisseries exposees"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 to-transparent" />
          </motion.div>

          <div className="order-2">
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight"
            >
              Notre Passion, Notre Savoir-Faire
            </motion.h2>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-chocolate-50 font-sans text-lg leading-relaxed mt-6 max-w-[55ch]"
            >
              Gavroche partage une passion pour la patisserie italienne artisanale. Chaque creation est pensee comme une experience: des textures delicates, des saveurs equilibrees et une presentation elegante.
            </motion.p>

            <motion.blockquote
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 border-l-2 border-gold pl-6"
            >
              <p className="font-serif text-xl md:text-2xl text-chocolate italic leading-[1.4]">
                Apporter le gout authentique de l'artisanat patissier italien en Tunisie, avec creativite, ingredients de qualite et passion.
              </p>
            </motion.blockquote>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-cream-300"
            >
              <div>
                <p className="font-display text-3xl text-gold font-bold">100%</p>
                <p className="font-sans text-sm text-chocolate-50 mt-1">Fait maison</p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold font-bold">Italie</p>
                <p className="font-sans text-sm text-chocolate-50 mt-1">Inspiration</p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold font-bold">2</p>
                <p className="font-sans text-sm text-chocolate-50 mt-1">Boutiques</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
