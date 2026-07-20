import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import SignatureCreams from '../components/SignatureCreams'
import Menu from '../components/Menu'
import SignatureDesserts from '../components/SignatureDesserts'
import Gallery from '../components/Gallery'
import Ordering from '../components/Ordering'
import Events from '../components/Events'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SignatureCreams />
        <Menu />
        <SignatureDesserts />
        <Gallery />
        <Ordering />
        <Events />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
