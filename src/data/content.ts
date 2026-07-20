const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const images = {
  heroTiramisu: img('1757747704849-f04e828f0f9e', 2000),
  chocolateMousse: img('1744988870979-43fcbfdd0804', 1200),
  chocolateDessert: img('1678969405727-1a1e2a572119', 1200),
  shopInterior: img('1753459843733-e511502eca0d', 1200),
  dessertDisplay: img('1757640905792-3d8e7dc37c0c', 1200),
  cafeCounter: img('1756158449200-678a8de156ac', 1200),
  cheesecakeNuts: img('1768341857441-9084cfd8676e', 1200),
  cheesecakePlate: img('1773632996592-e150b9ed5059', 1200),
  cheesecakeCrumb: img('1757009376509-0367cabbd060', 1200),
  cheesecakeFork: img('1706799419579-592e69a2bf8f', 1200),
  cannoliSpread: img('1777333033347-6757045adc9c', 1200),
}

export const brand = {
  name: 'Gavroche',
  tagline: 'Pâtisserie Italienne Artisanale',
  phone1: '+216 52 525 346',
  phone2: '+216 52 525 336',
  whatsapp: '21652525346',
  whatsappLink: 'https://wa.me/21652525346?text=Bonjour%20Gavroche%2C%20je%20souhaite%20commander.',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
}

export const locations = [
  {
    name: 'Sidi Bou Said',
    address: '7 Impasse Bir Sidi Taieb',
    city: 'Sidi Bou Said 2026',
    country: 'Tunisie',
    label: 'Boutique principale',
  },
  {
    name: 'Ariana',
    address: '16 Rue Mahmoud Annabi',
    city: 'Ariana 2091',
    country: 'Tunisie',
    label: 'Seconde adresse',
  },
]

export const navLinks = [
  { label: 'Créations', href: '#creations' },
  { label: 'Savoir-Faire', href: '#savoir-faire' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Événements', href: '#evenements' },
  { label: 'Contact', href: '#contact' },
]

export const creams = [
  {
    name: 'Crème de Pistache',
    description: 'Une création onctueuse à la pistache, texture riche et saveur authentique.',
    image: images.cheesecakeNuts,
    accent: 'pistachio',
  },
  {
    name: 'Crème de Noisette',
    description: 'Noisette torréfiée fondante, inspirée des traditions pâtissières italiennes.',
    image: images.chocolateDessert,
    accent: 'gold',
  },
  {
    name: 'Crème au Chocolat',
    description: 'Desserts au chocolat d\'exception, pensés pour les amateurs de ganache intense.',
    image: images.chocolateMousse,
    accent: 'chocolate',
  },
  {
    name: 'Crèmes Laitières',
    description: 'Crèmes fraîches artisanales, préparées avec des ingrédients de qualité.',
    image: images.cheesecakeCrumb,
    accent: 'cream',
  },
]

export const menuCategories = [
  {
    name: 'Desserts',
    items: [
      { name: 'Cheesecakes', desc: 'Classique, caramel salé, fruits rouges' },
      { name: 'Tiramisu', desc: 'Recette italienne traditionnelle au mascarpone' },
      { name: 'Mousses', desc: 'Chocolat, pistache, fruits de saison' },
      { name: 'Tartes', desc: 'Tartes modernes aux fruits et crèmes pâtissières' },
      { name: 'Entremets', desc: 'Créations givrées à étages, présentation raffinée' },
    ],
  },
  {
    name: 'Spécialités Italiennes',
    items: [
      { name: 'Cannoli', desc: 'Tubes croustillants garnis de ricotta sucrée' },
      { name: 'Crèmes Italiennes', desc: 'Pistache, noisette, gianduja' },
      { name: 'Recettes Traditionnelles', desc: 'Millefoglie, choux, baba au rhum' },
    ],
  },
  {
    name: 'Chocolats',
    items: [
      { name: 'Créations Chocolatées', desc: 'Mousses, ganaches, truffles artisanales' },
      { name: 'Confiseries Premium', desc: 'Pralinés, bonbons de chocolat' },
    ],
  },
  {
    name: 'Saisonnier',
    items: [
      { name: 'Éditions Limitées', desc: 'Créations exclusives selon les saisons' },
      { name: 'Occasions Spéciales', desc: 'Pièces montées et buffets personnalisés' },
    ],
  },
]

export const signatureDesserts = [
  {
    name: 'Collection Pistache',
    description: 'Desserts, crèmes et pâtisseries garnies à la pistache.',
    image: images.heroTiramisu,
  },
  {
    name: 'Collection Chocolat',
    description: 'Cakes, mousses et pâtisseries au chocolat d\'exception.',
    image: images.chocolateMousse,
  },
  {
    name: 'Collection Cheesecake',
    description: 'Cheesecake classique et caramel salé, crémeux à souhait.',
    image: images.cheesecakeNuts,
  },
  {
    name: 'Signature Gervais',
    description: 'Une expérience crémeuse unique, spécialité reconnue de Gavroche.',
    image: images.cheesecakeFork,
  },
]

export const galleryImages = [
  { src: images.heroTiramisu, alt: 'Tiramisu garni de figues et pistaches', span: 'lg:col-span-2' },
  { src: images.chocolateMousse, alt: 'Mousse au chocolat avec creme fouettee', span: '' },
  { src: images.cheesecakeNuts, alt: 'Part de cheesecake garnie de noix', span: '' },
  { src: images.shopInterior, alt: 'Interieur de boutique avec patisseries', span: 'lg:col-span-2' },
  { src: images.chocolateDessert, alt: 'Dessert au chocolat en verrine', span: '' },
  { src: images.cheesecakePlate, alt: 'Cheesecake sur assiette decorative', span: '' },
  { src: images.dessertDisplay, alt: 'Vitrine de patisseries', span: 'lg:col-span-2' },
  { src: images.cheesecakeCrumb, alt: 'Cheesecake avec crumble', span: 'lg:col-span-2' },
]

export const events = [
  { name: 'Anniversaires', desc: 'Gâteaux personnalisés et buffets sucrés sur mesure.' },
  { name: 'Mariages', desc: 'Pièces montées, tables de desserts et wedding cakes.' },
  { name: 'Événements Corporate', desc: 'Coffrets cadeaux et buffets pour entreprises.' },
  { name: 'Célébrations Privées', desc: 'Créations exclusives pour vos moments rares.' },
]

export const orderingOptions = [
  { name: 'Commande en ligne', desc: 'Passez commande directement via WhatsApp.' },
  { name: 'Retrait en boutique', desc: 'Retirez vos créations à Sidi Bou Said ou Ariana.' },
  { name: 'Livraison', desc: 'Livraison à domicile dans la région du Grand Tunis.' },
  { name: 'Commandes Événementielles', desc: 'Buffets et pièces montées pour vos célébrations.' },
]
