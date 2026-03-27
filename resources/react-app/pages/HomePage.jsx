import Header from '../components/layout/Header'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Gallery from '../components/sections/Gallery'
import Services from '../components/sections/Services'
import Contact from '../components/sections/Contact'
import Footer from '../components/layout/Footer'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default HomePage




