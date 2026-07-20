import { motion, useReducedMotion } from 'motion/react'
import { galleryImages } from '../data/content'

export default function Gallery() {
  const reduce = useReducedMotion()

  return (
    <section id="galerie" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight mb-12">
          Galerie
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[160px] lg:auto-rows-[220px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-xl group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
