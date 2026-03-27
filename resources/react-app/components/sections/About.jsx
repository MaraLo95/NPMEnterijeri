import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import './About.css'

const features = [
  'Kvalitetna Izrada',
  'Povoljne Cene',
  'Brza i Pouzdana Usluga',
  'Sveobuhvatna Rešenja',
  'Iskusni Profesionalci',
  'Uslužna montaža nameštaja',
  'Dizajniranje enterijera (3D)',
  'Kompletna izrada enterijera',
  'Postavljanje laminata',
  'Postavljanje podnih obloga'
]

function About() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>NPM Enterijeri Beograd</h2>
          <p>
            NPM Enterijeri je firma iz Beograda specijalizovana za izradu nameštaja po meri 
            i kompletno opremanje enterijera. Naš tim čine iskusni stolari, dizajneri i monteri, 
            posvećeni stvaranju funkcionalnih i estetski savršenih rešenja prilagođenih svakom prostoru.
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="/images/about-image.png" 
              alt="NPM Enterijeri tim" 
              loading="lazy"
            />
            <div className="experience-badge">
              <span className="number">10+</span>
              <span className="text">Godina iskustva</span>
            </div>
          </motion.div>

          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>Zašto izabrati nas?</h3>
            <p>
              Birajući <strong>NPM Enterijeri Beograd</strong>, dobijate kvalitetnu izradu 
              nameštaja po meri, povoljne cene i brzu, pouzdanu uslugu. Nudimo sveobuhvatna 
              rešenja koja uključuju dizajniranje enterijera u 3D prikazu, kompletnu izradu, 
              uslužnu montažu nameštaja, kao i postavljanje laminata i drugih podnih obloga.
            </p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature}
                  className="feature-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <p className="about-extra">
              Kod nas možete pronaći sve na jednom mestu – od idejnog rešenja i projektovanja, 
              do završne montaže, popravki i organizovanog prevoza. Tokom vremena, ostvarili 
              smo uspešnu saradnju sa renomiranim kompanijama kao što su Yandex, Naruto i Milšped.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About




