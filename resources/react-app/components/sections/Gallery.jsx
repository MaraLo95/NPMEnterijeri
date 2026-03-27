import { useState, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { useGallery } from '../../context/GalleryContext'
import './Gallery.css'

const categories = [
  { id: 'all', label: 'Sve' },
  { id: 'kreacije', label: 'Naše kreacije' },
  { id: 'renderi', label: '3D Renderi' },
  { id: 'montaza', label: 'Uslužna montaža' }
]

function Gallery() {
  const { galleryItems, isLoading } = useGallery()
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems
    return galleryItems.filter(item => item.category === activeCategory)
  }, [galleryItems, activeCategory])

  if (isLoading) {
    return (
      <section id="gallery" className="gallery section">
        <div className="container">
          <div className="gallery-loading">
            <div className="spinner"></div>
            <p>Učitavanje galerije...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="gallery section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>NPM Enterijeri Galerija</h2>
          <p>
            Pogledajte fotografije naših završenih projekata i radova sa terena. 
            Prikazujemo kuhinje po meri, ugradne plakare, krevete, stolove i 
            kompletna rešenja za enterijer po meri.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="gallery-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="gallery-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="gallery-item"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedImage(item)}
              >
                <div className="gallery-image">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <button className="zoom-btn">
                      <i className="bi bi-zoom-in"></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="gallery-empty">
            <i className="bi bi-images"></i>
            <p>Nema fotografija u ovoj kategoriji.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
              <img src={selectedImage.image} alt={selectedImage.title} />
              <div className="lightbox-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery




