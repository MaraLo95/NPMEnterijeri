import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const typedTexts = ['NPM Enterijeri', 'Nameštaj Po Meri', 'Kvalitet i Pouzdanost']

function Hero() {
  const [currentText, setCurrentText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const targetText = typedTexts[textIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = 2000

    if (!isDeleting && currentText === targetText) {
      setTimeout(() => setIsDeleting(true), pauseTime)
      return
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false)
      setTextIndex((prev) => (prev + 1) % typedTexts.length)
      return
    }

    const timeout = setTimeout(() => {
      setCurrentText(prev => 
        isDeleting 
          ? targetText.substring(0, prev.length - 1)
          : targetText.substring(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, textIndex, isDeleting])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <img 
          src="/images/hero-bg.jpg" 
          alt="NPM Enterijeri - Namestaj po meri" 
          loading="eager"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Nameštaj po meri Enterijeri
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Dobrodošli na sajt kompanije{' '}
            <span className="typed-text">{currentText}</span>
            <span className="typed-cursor">|</span>
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('gallery')}
            >
              <i className="bi bi-images"></i>
              Pogledaj naše radove
            </button>
            <button 
              className="btn btn-gold"
              onClick={() => scrollToSection('contact')}
            >
              <i className="bi bi-calendar-check"></i>
              Zakažite konsultacije
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-indicator">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <i className="bi bi-chevron-down"></i>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero




