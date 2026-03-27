import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import './Services.css'

const services = [
  {
    id: 1,
    icon: 'bi-vector-pen',
    title: 'Projektovanje i dizajn',
    description: 'Stručno projektovanje i dizajn nameštaja po meri. Tehnički crtež, savremeni dizajn enterijera i personalizovana rešenja za svaki prostor.',
    color: 'cyan'
  },
  {
    id: 2,
    icon: 'bi-rulers',
    title: 'Izrada nameštaja po meri',
    description: 'Izrada nameštaja po meri koji se savršeno uklapa u vaš prostor – kuhinje, plakare, radne stolove i više. Od ideje do montaže.',
    color: 'orange'
  },
  {
    id: 3,
    icon: 'bi-house-gear',
    title: 'Uslužna montaža nameštaja',
    description: 'Profesionalna montaža nameštaja u Beogradu uključuje brzo, precizno i sigurno postavljanje svih elemenata.',
    color: 'teal'
  },
  {
    id: 4,
    icon: 'bi-buildings',
    title: 'Opremanje poslovnih prostorija',
    description: 'Specijalizovani smo za opremanje poslovnih prostora po meri – kancelarije, ordinacije, saloni i lokalni objekti.',
    color: 'red'
  },
  {
    id: 5,
    icon: 'bi-layers',
    title: 'Postavljanje podnih obloga',
    description: 'Profesionalno postavljanje podnih obloga – laminata, tarketa, burmateksa i drugih materijala sa garancijom.',
    color: 'indigo'
  },
  {
    id: 6,
    icon: 'bi-plug',
    title: 'Propratni električni radovi',
    description: 'Obavljamo propratne električarske radove, omogućavajući da vaš enterijer bude potpuno funkcionalan.',
    color: 'pink'
  }
]

function Services() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="services" className="services section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Usluge NPM Enterijeri</h2>
          <p>
            Naše usluge pružaju kompletna rešenja u oblasti izrade nameštaja po meri, 
            dizajna enterijera i opremanja prostora. Radimo sa visokokvalitetnim materijalima 
            i savremenim tehnologijama.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`service-card ${service.color}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="service-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 600 600">
                    <path d="M300,521C376,517,466,529,510,468C554,407,508,328,491,256C474,184,479,96,416,58C348,18,261,40,193,78C130,114,98,179,76,249C51,328,13,421,66,486C119,550,217,524,300,521"></path>
                  </svg>
                </div>
                <i className={`bi ${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services




