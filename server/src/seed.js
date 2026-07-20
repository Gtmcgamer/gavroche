import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Product from './models/Product.js'
import DailyMenu from './models/DailyMenu.js'
import OrderRequest from './models/OrderRequest.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gavroche'

const productData = [
  {
    name: 'Cheesecake Pistache',
    description: "Cheesecake artisanal avec crème pistache premium de Sicile, base biscuit spéculoos croustillant.",
    category: 'pistachio',
    price: 18,
    image: 'https://images.unsplash.com/photo-1768341857441-9084cfd8676e?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten', 'noix'],
    preparationTime: 180,
    isFeatured: true,
  },
  {
    name: 'Tiramisu Fichi e Pistacchi',
    description: "Tiramisu traditionnel revisité avec figues fraîches caramélisées et pistaches de Bronte.",
    category: 'tiramisu',
    price: 15,
    image: 'https://images.unsplash.com/photo-1757747704849-f04e828f0f9e?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten'],
    preparationTime: 240,
    isFeatured: true,
  },
  {
    name: 'Mousse au Chocolat Noir',
    description: "Mousse aérienne au chocolat noir Valrhona 70 %, chantilly légère à la vanille bourbon.",
    category: 'chocolate',
    price: 12,
    image: 'https://images.unsplash.com/photo-1744988870979-43fcbfdd0804?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs'],
    preparationTime: 120,
    isFeatured: false,
  },
  {
    name: 'Cheesecake Caramel Salé',
    description: "Cheesecake new-yorkais onctueux nappé d'un coulis de caramel au beurre salé de Bretagne.",
    category: 'cheesecake',
    price: 18,
    image: 'https://images.unsplash.com/photo-1773632996592-e150b9ed5059?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten'],
    preparationTime: 180,
    isFeatured: false,
  },
  {
    name: 'Tarte Chocolat Noisette',
    description: "Tarte fine au chocolat gianduja, éclats de noisettes du Piémont caramélisées à la fleur de sel.",
    category: 'chocolate',
    price: 14,
    image: 'https://images.unsplash.com/photo-1678969405727-1a1e2a572119?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten', 'noix'],
    preparationTime: 150,
    isFeatured: false,
  },
  {
    name: 'Cannoli Siciliani',
    description: "Cannoli croustillants à la ricotta fraîche sucrée, pépites de chocolat noir et zeste d'orange confite.",
    category: 'italian',
    price: 8,
    image: 'https://images.unsplash.com/photo-1706799419579-592e69a2bf8f?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten'],
    preparationTime: 60,
    isFeatured: false,
  },
  {
    name: 'Cheesecake Fruits Rouges',
    description: "Cheesecake classique avec son coulis de fraises et framboises fraîches, base graham cracker.",
    category: 'cheesecake',
    price: 16,
    image: 'https://images.unsplash.com/photo-1757009376509-0367cabbd060?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten'],
    preparationTime: 180,
    isFeatured: false,
  },
  {
    name: 'Entremets Pistache Framboise',
    description: "Entremets à étages : mousse pistache, insert framboise intense, glaçage miroir vert brillant.",
    category: 'seasonal',
    price: 22,
    image: 'https://images.unsplash.com/photo-1768341857441-9084cfd8676e?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten', 'noix'],
    preparationTime: 360,
    isFeatured: true,
  },
  {
    name: 'Panna Cotta Vanille',
    description: "Panna cotta soyeuse à la vanille de Madagascar, coulis de fruits de la passion maison.",
    category: 'italian',
    price: 10,
    image: 'https://images.unsplash.com/photo-1773632996592-e150b9ed5059?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait'],
    preparationTime: 90,
    isFeatured: false,
  },
  {
    name: 'Cheesecake Citron Basilic',
    description: "Cheesecake rafraîchissant au citron de Sicile, notes herbacées de basilic frais.",
    category: 'cheesecake',
    price: 17,
    image: 'https://images.unsplash.com/photo-1757009376509-0367cabbd060?w=600&q=80&auto=format&fit=crop',
    allergens: ['lait', 'oeufs', 'gluten'],
    preparationTime: 180,
    isFeatured: false,
  },
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ Connecté à MongoDB')

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    DailyMenu.deleteMany({}),
    OrderRequest.deleteMany({}),
  ])
  console.log('🗑️  Collections vidées')

  const admin = await User.create({
    username: 'admin',
    password: 'gavroche2024',
    role: 'admin',
  })
  console.log(`👤 Admin créé: ${admin.username} / gavroche2024`)

  const products = await Product.insertMany(productData)
  console.log(`🍰 ${products.length} produits créés`)

  const today = new Date().toISOString().split('T')[0]
  const menu = await DailyMenu.create({
    date: today,
    notes: 'Sélection du lundi — production matinale',
    products: [
      { productId: products[0]._id, quantityAvailable: 6, quantitySold: 2, status: 'available' },
      { productId: products[1]._id, quantityAvailable: 2, quantitySold: 3, status: 'limited' },
      { productId: products[2]._id, quantityAvailable: 0, quantitySold: 8, status: 'soldout' },
      { productId: products[3]._id, quantityAvailable: 5, quantitySold: 0, status: 'available' },
      { productId: products[4]._id, quantityAvailable: 3, quantitySold: 1, status: 'limited' },
      { productId: products[5]._id, quantityAvailable: 10, quantitySold: 0, status: 'available' },
      { productId: products[7]._id, quantityAvailable: 4, quantitySold: 0, status: 'available' },
    ],
  })
  console.log(`📋 Menu du ${today} créé avec ${menu.products.length} produits`)

  await OrderRequest.insertMany([
    {
      customerName: 'Sarah Ben Ali',
      phone: '+21655123456',
      items: [
        { productId: products[0]._id, productName: 'Cheesecake Pistache', quantity: 2, price: 18 },
        { productId: products[1]._id, productName: 'Tiramisu Fichi e Pistacchi', quantity: 1, price: 15 },
      ],
      pickupDate: today,
      pickupTime: '17:00',
      notes: 'Paiement en espèces',
      status: 'paid',
    },
    {
      customerName: 'Mohamed Trabelsi',
      phone: '+21698765432',
      items: [
        { productId: products[3]._id, productName: 'Cheesecake Caramel Salé', quantity: 1, price: 18 },
      ],
      pickupDate: today,
      pickupTime: '18:30',
      notes: '',
      status: 'paid',
    },
    {
      customerName: 'Leila Gharbi',
      phone: '+21622334455',
      items: [
        { productId: products[7]._id, productName: 'Entremets Pistache Framboise', quantity: 1, price: 22 },
        { productId: products[5]._id, productName: 'Cannoli Siciliani', quantity: 4, price: 8 },
      ],
      pickupDate: today,
      pickupTime: '19:00',
      notes: 'Commande anniversaire',
      status: 'cancelled',
    },
  ])
  console.log('📦 3 commandes de démonstration créées')

  await mongoose.disconnect()
  console.log('✨ Données de démonstration insérées avec succès!')
  console.log('   → Connexion admin: admin / gavroche2024')
}

seed().catch((err) => {
  console.error('❌', err)
  process.exit(1)
})
