import { MapPin, Phone, InstagramLogo, FacebookLogo, WhatsappLogo } from '@phosphor-icons/react'
import { brand, locations, navLinks } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-chocolate-400 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-cream-50/10">
          <div className="lg:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-bold text-cream-50">Gavroche</span>
              <span className="font-serif text-[10px] tracking-[0.22em] uppercase mt-1 text-gold">
                Patisserie Italienne
              </span>
            </div>
            <p className="text-cream-200 font-sans text-sm leading-relaxed max-w-xs">
              L'art de la patisserie italienne artisanale en Tunisie. Creations raffinees preparees avec passion.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm text-gold uppercase tracking-[0.18em] mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream-200 font-sans text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-gold uppercase tracking-[0.18em] mb-5">
              Boutiques
            </h4>
            <ul className="space-y-4">
              {locations.map((loc) => (
                <li key={loc.name}>
                  <p className="text-cream-50 font-sans text-sm font-medium">{loc.name}</p>
                  <p className="text-cream-200 font-sans text-xs mt-0.5 leading-relaxed">
                    {loc.address}, {loc.city}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-gold uppercase tracking-[0.18em] mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream-200 font-sans text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                {brand.phone1}
              </li>
              <li className="flex items-center gap-3 text-cream-200 font-sans text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                {brand.phone2}
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={brand.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-cream-50/10 flex items-center justify-center text-cream-50 hover:bg-pistachio hover:text-chocolate transition-colors duration-300"
              >
                <WhatsappLogo size={18} weight="fill" />
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-cream-50/10 flex items-center justify-center text-cream-50 hover:bg-pistachio hover:text-chocolate transition-colors duration-300"
              >
                <InstagramLogo size={18} />
              </a>
              <a
                href={brand.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-cream-50/10 flex items-center justify-center text-cream-50 hover:bg-pistachio hover:text-chocolate transition-colors duration-300"
              >
                <FacebookLogo size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-200/60 font-sans text-xs">
            © {new Date().getFullYear()} Gavroche. Tous droits reserves.
          </p>
          <p className="text-cream-200/60 font-sans text-xs">
            Patisserie Italienne Artisanale — Tunisie
          </p>
        </div>
      </div>
    </footer>
  )
}
