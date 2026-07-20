import { motion, useReducedMotion } from 'motion/react'
import { signatureDesserts } from '../data/content'

export default function SignatureDesserts() {
  const reduce = useReducedMotion()

  return (
    <section className="py-24 lg:py-32 bg-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight mb-12 lg:mb-16">
          Desserts Signature
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {signatureDesserts.map((dessert, i) => (
            <motion.div
              key={dessert.name}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                <img
                  src={dessert.image}
                  alt={dessert.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-2xl text-chocolate font-semibold">
                {dessert.name}
              </h3>
              <p className="text-chocolate-50 font-sans text-base mt-2 max-w-md leading-relaxed">
                {dessert.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
