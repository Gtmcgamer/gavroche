import type { ProductStatus } from '../../types'

interface Props {
  status: ProductStatus
  quantity?: number
}

const CONFIG: Record<ProductStatus, { label: string; classes: string }> = {
  available: {
    label: 'Disponibile',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  limited: {
    label: 'Ultimi pezzi',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  soldout: {
    label: 'Esaurito',
    classes: 'bg-red-50 text-red-500 border-red-200',
  },
  coming_soon: {
    label: 'Prossimamente',
    classes: 'bg-blue-50 text-blue-600 border-blue-200',
  },
}

export default function StatusBadge({ status, quantity }: Props) {
  const { label, classes } = CONFIG[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold font-sans uppercase tracking-wider px-2.5 py-1 rounded-full border ${classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'available' ? 'animate-pulse' : ''}`} />
      {status === 'limited' && quantity !== undefined && quantity > 0
        ? `Solo ${quantity}`
        : label}
    </span>
  )
}
