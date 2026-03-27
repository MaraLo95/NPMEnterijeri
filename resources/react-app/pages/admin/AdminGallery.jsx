import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useGallery } from '../../context/GalleryContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminStyles.css'

const categories = [
  { id: 'kreacije', label: 'Naše kreacije' },
  { id: 'renderi', label: '3D Renderi' },
  { id: 'montaza', label: 'Uslužna montaža' }
]

function AdminGallery() {
  const navigate = useNavigate()
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useGallery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'kreacije',
    image: '',
    featured: false
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) {
      navigate('/admin/login')
    }
  }, [navigate])

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        image: item.image,
        featured: item.featured
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        description: '',
        category: 'kreacije',
        image: '',
        featured: false
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      category: 'kreacije',
      image: '',
      featured: false
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In production, upload to server/cloud storage
      // For demo, using local URL or data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.image) {
      toast.error('Molimo popunite sva obavezna polja')
      return
    }

    if (editingItem) {
      updateGalleryItem(editingItem.id, formData)
      toast.success('Fotografija je uspešno ažurirana!')
    } else {
      addGalleryItem(formData)
      toast.success('Fotografija je uspešno dodata!')
    }

    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu fotografiju?')) {
      deleteGalleryItem(id)
      toast.success('Fotografija je obrisana')
    }
  }

  const toggleFeatured = (item) => {
    updateGalleryItem(item.id, { featured: !item.featured })
    toast.success(item.featured ? 'Uklonjena sa istaknutih' : 'Dodata u istaknute')
  }

  return (
    <AdminLayout>
      <div className="admin-gallery">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Upravljanje galerijom</h1>
            <p>Dodajte, uredite ili obrišite fotografije iz galerije</p>
          </div>
          <button className="btn-add" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i>
            Dodaj fotografiju
          </button>
        </div>

        {/* Filters */}
        <div className="gallery-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pretraži galeriju..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={filterCategory === 'all' ? 'active' : ''}
              onClick={() => setFilterCategory('all')}
            >
              Sve ({galleryItems.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={filterCategory === cat.id ? 'active' : ''}
                onClick={() => setFilterCategory(cat.id)}
              >
                {cat.label} ({galleryItems.filter(i => i.category === cat.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div className="gallery-admin-grid" layout>
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="gallery-admin-item"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                  {item.featured && (
                    <span className="featured-badge">
                      <i className="bi bi-star-fill"></i>
                    </span>
                  )}
                  <div className="item-overlay">
                    <button onClick={() => openModal(item)} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={() => toggleFeatured(item)} title={item.featured ? 'Ukloni sa istaknutih' : 'Dodaj u istaknute'}>
                      <i className={`bi bi-star${item.featured ? '-fill' : ''}`}></i>
                    </button>
                    <button onClick={() => handleDelete(item.id)} title="Obriši" className="delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="item-category">
                    {categories.find(c => c.id === item.category)?.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-images"></i>
            <h3>Nema fotografija</h3>
            <p>Dodajte prvu fotografiju klikom na dugme iznad.</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{editingItem ? 'Uredi fotografiju' : 'Dodaj novu fotografiju'}</h2>
                  <button className="modal-close" onClick={closeModal}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Image Upload */}
                    <div className="image-upload">
                      {formData.image ? (
                        <div className="image-preview">
                          <img src={formData.image} alt="Preview" />
                          <button 
                            type="button"
                            className="remove-image"
                            onClick={() => setFormData({ ...formData, image: '' })}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="upload-area"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="bi bi-cloud-upload"></i>
                          <p>Kliknite za upload slike</p>
                          <span>PNG, JPG do 5MB</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </div>

                    <div className="form-group">
                      <label>Naslov *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Unesite naslov fotografije"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Opis</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Kratak opis fotografije..."
                        rows="3"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Kategorija</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Opcije</label>
                        <label className="checkbox-option">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          />
                          <span className="checkmark"></span>
                          Istaknuta fotografija
                        </label>
                      </div>
                    </div>

                    {/* URL Input as alternative */}
                    <div className="form-group">
                      <label>Ili unesite URL slike</label>
                      <input
                        type="url"
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/slika.jpg"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={closeModal}>
                      Otkaži
                    </button>
                    <button type="submit" className="btn-save">
                      <i className="bi bi-check-lg"></i>
                      {editingItem ? 'Sačuvaj izmene' : 'Dodaj fotografiju'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminGallery




