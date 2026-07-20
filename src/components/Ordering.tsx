import { motion, useReducedMotion } from 'motion/react'
import { WhatsappLogo, Storefront, Truck, CalendarDots } from '@phosphor-icons/react'
import { orderingOptions, brand } from '../data/content'

const icons = [WhatsappLogo, Storefront, Truck, CalendarDots]

export default function Ordering() {
  const reduce = useReducedMotion()

  return (
    <section id="commander" className="py-24 lg:py-32 bg-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold mb-4">
            Commander
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight">
            Passez Commande
          </h2>
          <p className="text-chocolate-50 font-sans text-lg mt-4">
            Plusieurs options pour deguster nos creations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-14 max-w-4xl mx-auto mb-14">
          {orderingOptions.map((option, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={option.name}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center w-[140px] sm:w-[180px]"
              >
                <div className="w-14 h-14 rounded-full bg-pistachio/20 flex items-center justify-center mb-4">
                  <Icon size={28} className="text-pistachio-dark" />
                </div>
                <h3 className="font-display text-base text-chocolate font-semibold leading-tight">
                  {option.name}
                </h3>
                <p className="text-chocolate-50 font-sans text-sm mt-1.5 leading-relaxed">
                  {option.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <a
            href={brand.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-pistachio text-chocolate px-8 py-4 rounded-full font-sans text-lg font-semibold hover:bg-pistachio-dark transition-colors duration-300 active:scale-[0.98]"
          >
            <WhatsappLogo size={24} weight="fill" />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
