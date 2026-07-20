import { motion, useReducedMotion } from 'motion/react'
import { Cake, Diamond, Buildings, Sparkle } from '@phosphor-icons/react'
import { events, brand } from '../data/content'

const icons = [Cake, Diamond, Buildings, Sparkle]

export default function Events() {
  const reduce = useReducedMotion()

  return (
    <section id="evenements" className="py-24 lg:py-32 bg-chocolate-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pistachio blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold mb-4">
            Evenements
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cream-50 leading-[1.1] tracking-tight">
            Célébrations & Événements
          </h2>
          <p className="text-cream-200 font-sans text-lg mt-4">
            Des creations sur mesure pour vos moments d'exception.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={event.name}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="border border-cream-50/10 rounded-2xl p-6 hover:border-gold/40 hover:bg-cream-50/[0.03] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-cream-50 font-semibold">
                  {event.name}
                </h3>
                <p className="text-cream-200 font-sans text-sm mt-2 leading-relaxed">
                  {event.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14"
        >
          <a
            href={brand.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gold/50 text-gold px-7 py-3.5 rounded-full font-sans text-base font-semibold hover:bg-gold hover:text-chocolate transition-colors duration-300 active:scale-[0.98]"
          >
            Demander un devis
          </a>
        </motion.div>
      </div>
    </section>
  )
}
