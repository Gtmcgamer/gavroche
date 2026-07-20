import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { List, X, WhatsappLogo } from '@phosphor-icons/react'
import { brand, navLinks } from '../data/content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60)
  })

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream-50/95 backdrop-blur-md shadow-[0_2px_20px_rgba(43,27,22,0.08)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <a href="#top" className="flex flex-col leading-none">
            <span
              className={`font-display text-2xl font-bold tracking-tight transition-colors duration-500 ${
                scrolled ? 'text-chocolate' : 'text-cream-50'
              }`}
            >
              Gavroche
            </span>
            <span
              className={`font-serif text-[10px] tracking-[0.22em] uppercase mt-1 transition-colors duration-500 ${
                scrolled ? 'text-gold' : 'text-cream-200'
              }`}
            >
              Patisserie Italienne
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium transition-colors hover:text-gold duration-300 ${
                  scrolled ? 'text-chocolate-50' : 'text-cream-50'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={brand.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-pistachio text-chocolate px-5 py-2.5 rounded-full font-sans text-sm font-semibold hover:bg-pistachio-dark transition-colors duration-300 active:scale-[0.98]"
            >
              <WhatsappLogo size={18} weight="fill" />
              Commander
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className={`lg:hidden transition-colors duration-500 ${
              scrolled ? 'text-chocolate' : 'text-cream-50'
            }`}
            aria-label="Ouvrir le menu"
          >
            <List size={28} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-chocolate lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-cream-50">Gavroche</span>
                <span className="font-serif text-[10px] tracking-[0.22em] uppercase mt-1 text-gold">
                  Patisserie Italienne
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="text-cream-50"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col px-6 pt-12 gap-7">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="font-display text-3xl text-cream-50 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={brand.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-pistachio text-chocolate px-6 py-4 rounded-full font-sans text-base font-semibold active:scale-[0.98]"
              >
                <WhatsappLogo size={20} weight="fill" />
                Commander maintenant
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
