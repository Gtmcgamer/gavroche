import { motion, useReducedMotion } from 'motion/react'
import { MapPin, Phone, InstagramLogo, FacebookLogo, Clock } from '@phosphor-icons/react'
import { locations, brand } from '../data/content'

export default function Contact() {
  const reduce = useReducedMotion()

  return (
    <section id="contact" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold mb-4">
              Nous Trouver
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-chocolate leading-[1.1] tracking-tight">
              Visitez-nous
            </h2>
            <p className="text-chocolate-50 font-sans text-lg mt-4 max-w-md">
              Deux boutiques en Tunisie pour decouvrir nos creations.
            </p>

            <div className="mt-10 space-y-8">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-pistachio/20 flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-pistachio-dark" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-1">
                      {loc.label}
                    </p>
                    <h3 className="font-display text-xl text-chocolate font-semibold">
                      {loc.name}
                    </h3>
                    <p className="text-chocolate-50 font-sans text-sm mt-1 leading-relaxed">
                      {loc.address}<br />
                      {loc.city}, {loc.country}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-cream-300 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-gold-dark" />
                </div>
                <div>
                  <p className="font-sans text-sm text-chocolate-50">{brand.phone1}</p>
                  <p className="font-sans text-sm text-chocolate-50">{brand.phone2}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-gold-dark" />
                </div>
                <p className="font-sans text-sm text-chocolate-50">
                  Lun — Dim: 9h00 — 22h00
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden min-h-[400px] lg:min-h-full relative"
          >
            <iframe
              title="Gavroche Sidi Bou Said"
              src="https://www.openstreetmap.org/export/embed.html?bbox=10.348%2C36.866%2C10.362%2C36.876&layer=mapnik&marker=36.871%2C10.355"
              className="w-full h-full absolute inset-0 border-0"
              loading="lazy"
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 mt-12"
        >
          <span className="font-sans text-sm text-chocolate-50">Suivez-nous:</span>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-chocolate hover:bg-pistachio hover:text-chocolate transition-colors duration-300"
          >
            <InstagramLogo size={20} />
          </a>
          <a
            href={brand.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-chocolate hover:bg-pistachio hover:text-chocolate transition-colors duration-300"
          >
            <FacebookLogo size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
