import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  QrCode,
  Copy,
  DownloadSimple,
  Printer,
  Check,
  ArrowSquareOut,
} from '@phosphor-icons/react'

const SIZES = [
  { label: 'S', value: 150 },
  { label: 'M', value: 250 },
  { label: 'L', value: 400 },
  { label: 'XL', value: 600 },
]

function buildQrUrl(data: string, size: number) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data,
    format: 'png',
    margin: '2',
  })
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
}

export default function AdminQRCode() {
  const defaultUrl = `${window.location.origin}/menu`
  const [url, setUrl] = useState(defaultUrl)
  const [size, setSize] = useState(250)
  const [copied, setCopied] = useState(false)
  const [imgError, setImgError] = useState(false)

  const qrSrc = buildQrUrl(url || defaultUrl, size)
  const downloadSrc = buildQrUrl(url || defaultUrl, 600)

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(url || defaultUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [url, defaultUrl])

  const download = () => {
    const a = document.createElement('a')
    a.href = downloadSrc
    a.download = 'gavroche-menu-qr.png'
    a.target = '_blank'
    a.click()
  }

  const print = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>QR Code — Menu Gavroche</title>
      <style>
        body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; background: #fff; }
        img { width: 300px; height: 300px; }
        p { margin-top: 16px; font-size: 14px; color: #555; word-break: break-all; text-align: center; max-width: 320px; }
        h2 { font-size: 22px; margin-bottom: 4px; }
      </style></head>
      <body>
        <h2>Gavroche — Menu</h2>
        <img src="${downloadSrc}" onload="window.print()" />
        <p>${url || defaultUrl}</p>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div className="space-y-6 overflow-y-auto flex-1">
      <div>
        <h1 className="font-display text-2xl font-bold text-chocolate">QR Code Menu</h1>
        <p className="font-sans text-sm text-chocolate-100 mt-0.5">
          Générez un QR code pour votre page menu à afficher en caisse ou à imprimer.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-cream-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block font-sans text-xs font-bold text-chocolate-100 uppercase tracking-wide mb-2">
              URL cible
            </label>
            <div className="flex gap-2">
              <input
                value={url}
                onChange={(e) => { setUrl(e.target.value); setImgError(false) }}
                placeholder={defaultUrl}
                className="flex-1 border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate focus:outline-none focus:border-chocolate transition bg-cream-50"
              />
              <a
                href={url || defaultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2.5 border border-cream-200 rounded-xl text-chocolate-100 hover:text-chocolate hover:border-chocolate transition"
                title="Ouvrir le lien"
              >
                <ArrowSquareOut size={16} />
              </a>
            </div>
            <button
              onClick={() => setUrl(defaultUrl)}
              className="mt-1.5 font-sans text-xs text-pistachio-dark hover:underline"
            >
              Réinitialiser à l'URL du menu
            </button>
          </div>

          <div>
            <label className="block font-sans text-xs font-bold text-chocolate-100 uppercase tracking-wide mb-2">
              Taille du QR code
            </label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`flex-1 py-2 rounded-xl font-sans text-sm font-semibold transition-colors ${
                    size === s.value
                      ? 'bg-chocolate text-cream-50'
                      : 'bg-cream-100 text-chocolate-100 hover:bg-cream-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={copyUrl}
              className="flex-1 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 text-chocolate py-3 rounded-xl font-sans font-semibold text-sm transition-colors"
            >
              {copied ? <Check size={16} weight="bold" className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? 'Copié !' : 'Copier le lien'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={download}
              className="flex-1 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 text-chocolate py-3 rounded-xl font-sans font-semibold text-sm transition-colors"
            >
              <DownloadSimple size={16} />
              Télécharger
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={print}
              className="flex items-center justify-center gap-2 bg-chocolate hover:bg-chocolate-200 text-cream-50 px-5 py-3 rounded-xl font-sans font-semibold text-sm transition-colors"
            >
              <Printer size={16} />
              Imprimer
            </motion.button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cream-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4">
          {imgError ? (
            <div className="flex flex-col items-center gap-3 text-chocolate-100">
              <QrCode size={48} className="text-cream-200" />
              <p className="font-sans text-sm text-center">
                Impossible de générer le QR code.<br />Vérifiez votre connexion internet.
              </p>
            </div>
          ) : (
            <motion.img
              key={qrSrc}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={qrSrc}
              alt="QR Code Menu"
              onError={() => setImgError(true)}
              className="rounded-2xl border-4 border-cream-100"
              style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
            />
          )}
          <p className="font-sans text-xs text-chocolate-100 text-center max-w-[240px] break-all">
            {url || defaultUrl}
          </p>
        </div>
      </div>
    </div>
  )
}
