import { motion, useReducedMotion } from 'motion/react'
import { creams } from '../data/content'

export default function SignatureCreams() {
  const reduce = useReducedMotion()

  return (
    <section id="creations" className="py-24 lg:py-32 bg-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight max-w-2xl"
        >
          Nos Cremes Signature
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-chocolate-50 font-sans text-lg mt-4 max-w-[55ch]"
        >
          Quatre creations onctueuses au coeur de notre savoir-faire italien.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 lg:mt-16 auto-rows-[220px] lg:auto-rows-[250px]">
          {creams.map((cream, i) => (
            <motion.div
              key={cream.name}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-2xl group ${
                i === 0 ? 'lg:col-span-2 lg:row-span-2' : i === 1 ? 'lg:col-span-2' : ''
              }`}
            >
              <img
                src={cream.image}
                alt={cream.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-400/90 via-chocolate-300/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                <h3
                  className={`font-display text-cream-50 font-bold leading-tight ${
                    i === 0 ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
                  }`}
                >
                  {cream.name}
                </h3>
                <p className="text-cream-200 font-sans text-sm mt-2 leading-relaxed max-w-xs">
                  {cream.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
