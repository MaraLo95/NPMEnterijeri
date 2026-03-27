import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import './Contact.css'

const contactInfo = [
  {
    icon: 'bi-geo-alt',
    title: 'Adresa',
    value: 'Čukarica, Beograd, Srbija'
  },
  {
    icon: 'bi-telephone',
    title: 'Telefon',
    value: '+381 69 4617 255'
  },
  {
    icon: 'bi-envelope',
    title: 'Email',
    value: 'npmmontaza@gmail.com'
  }
]

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success('Poruka je uspešno poslata! Kontaktiraćemo vas uskoro.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="contact section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Kontakt</h2>
          <p>
            Imate pitanja ili vam je potrebna pomoć oko opremanja prostora? 
            Popunite formular i zakažite besplatne konsultacije sa našim stručnjacima.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Info */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((item, index) => (
              <motion.div 
                key={item.title}
                className="info-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="info-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="info-content">
                  <h4>{item.title}</h4>
                  <p>{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="social-links">
              <h4>Pratite nas</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/npm.enterijeri" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/npm.enterijeri/" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ime i prezime</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Vaše ime i prezime"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail adresa</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="vasa@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Naslov</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="Tema vaše poruke"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Poruka</label>
              <textarea
                name="message"
                className="form-textarea"
                placeholder="Opišite vaš projekat ili pitanje..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Slanje...
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i>
                  Pošalji poruku
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact




