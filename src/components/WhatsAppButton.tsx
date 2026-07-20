import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { brand } from '../data/content'

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={brand.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Commander sur WhatsApp"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-pistachio text-chocolate flex items-center justify-center shadow-[0_4px_20px_rgba(168,184,122,0.4)]"
        >
          <WhatsappLogo size={28} weight="fill" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
