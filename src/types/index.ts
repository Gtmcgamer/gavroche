export type ProductCategory = string

export type ProductStatus = 'available' | 'limited' | 'soldout' | 'coming_soon'

export type OrderStatus = 'paid' | 'cancelled'

export interface Product {
  _id: string
  name: string
  description: string
  category: ProductCategory
  price: number
  image: string
  isFeatured: boolean
  isActive: boolean
  views: number
  requestCount: number
  createdAt: string
  updatedAt: string
}

export interface DailyMenuItem {
  productId: Product
  quantityAvailable: number
  quantitySold: number
  status: ProductStatus
}

export interface DailyMenu {
  _id?: string
  date: string
  products: DailyMenuItem[]
  notes: string
}

export interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
}

export interface OrderRequest {
  _id: string
  customerName: string
  phone: string
  items: OrderItem[]
  pickupDate: string
  pickupTime: string
  notes: string
  discount: { type: 'percent' | 'fixed'; amount: number }
  status: OrderStatus
  totalAmount: number
  createdAt: string
}

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'staff'
}

export interface AnalyticsOverview {
  totalProducts: number
  availableToday: number
  limitedToday: number
  soldOutToday: number
  pendingOrders: number
  totalOrders: number
  todayProductCount: number
}

export interface ProductAnalytics {
  _id: string
  name: string
  views: number
  requestCount: number
  category: ProductCategory
  price: number
}

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
}

export const CATEGORY_LABELS: Record<string, string> = {
  cheesecake: 'Cheesecake',
  tiramisu: 'Tiramisu',
  italian: 'Desserts Italiens',
  chocolate: 'Chocolat',
  pistachio: 'Collection Pistache',
  seasonal: 'Créations Saisonnières',
  special: 'Commandes Spéciales',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  paid: 'Payée',
  cancelled: 'Annulée',
}
