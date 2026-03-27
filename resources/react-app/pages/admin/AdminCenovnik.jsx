import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiCall, API } from '../../config/api'
import './AdminStyles.css'

function AdminCenovnik() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(117.50)
  const [markup, setMarkup] = useState(25)
  
  const [formData, setFormData] = useState({
    vrstaUsluge: '',
    opisUsluge: '',
    jedinicaMere: 'KOM',
    cenaEUR: ''
  })

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) return
    apiCall(`${API.cenovnik.list}?all=true`)
      .then(res => {
        const data = res.data
        const items = Array.isArray(data) ? data : (data?.data || [])
        setProducts(items.map(c => ({
          id: c.id,
          vrstaUsluge: c.vrsta_usluge || '',
          opisUsluge: c.opis_usluge || '',
          jedinicaMere: c.jedinica_mere || 'KOM',
          cenaEUR: parseFloat(c.cena_eur) || 0
        })))
      })
      .catch(() => setProducts([]))
  }, [])

  const calculateRSD = (eur) => {
    return (eur * exchangeRate).toFixed(2)
  }

  const calculateMarkup = (value) => {
    return (value * (1 + markup / 100)).toFixed(2)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.vrstaUsluge.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.opisUsluge.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        vrstaUsluge: product.vrstaUsluge,
        opisUsluge: product.opisUsluge,
        jedinicaMere: product.jedinicaMere,
        cenaEUR: product.cenaEUR.toString()
      })
    } else {
      setEditingProduct(null)
      setFormData({
        vrstaUsluge: '',
        opisUsluge: '',
        jedinicaMere: 'KOM',
        cenaEUR: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSave = () => {
    if (!formData.vrstaUsluge || !formData.cenaEUR) return

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, cenaEUR: parseFloat(formData.cenaEUR) }
          : p
      ))
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...formData,
        cenaEUR: parseFloat(formData.cenaEUR)
      }
      setProducts([...products, newProduct])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleInlineEdit = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: field === 'cenaEUR' ? parseFloat(value) || 0 : value } : p
    ))
  }

  return (
    <AdminLayout>
      <div className="admin-cenovnik">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Cenovnik</h1>
            <p>Upravljajte cenama usluga i proizvoda</p>
          </div>
          <button className="btn-add" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-lg"></i>
            Dodaj novu uslugu
          </button>
        </div>

        {/* Settings Card */}
        <div className="cenovnik-settings">
          <div className="setting-item">
            <label>
              <i className="bi bi-currency-exchange"></i>
              Kurs EUR/RSD
            </label>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
          <div className="setting-item">
            <label>
              <i className="bi bi-percent"></i>
              Marža (%)
            </label>
            <input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
              step="1"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="cenovnik-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pretraži usluge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="cenovnik-table-container">
          <div className="cenovnik-table">
            <div className="table-header-row">
              <div className="th th-rb">R.B.</div>
              <div className="th th-vrsta">Vrsta usluge</div>
              <div className="th th-opis">Opis usluge</div>
              <div className="th th-jm">J.M.</div>
              <div className="th th-cena">Cena (EUR)</div>
              <div className="th th-cena">Cena (RSD)</div>
              <div className="th th-cena">{markup}% EUR</div>
              <div className="th th-cena">{markup}% RSD</div>
              <div className="th th-actions">Akcije</div>
            </div>
            
            <div className="table-body">
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="table-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <div className="td td-rb">{index + 1}</div>
                  <div className="td td-vrsta">
                    <input
                      type="text"
                      value={product.vrstaUsluge}
                      onChange={(e) => handleInlineEdit(product.id, 'vrstaUsluge', e.target.value)}
                      className="inline-edit"
                    />
                  </div>
                  <div className="td td-opis">
                    <input
                      type="text"
                      value={product.opisUsluge}
                      onChange={(e) => handleInlineEdit(product.id, 'opisUsluge', e.target.value)}
                      className="inline-edit"
                    />
                  </div>
                  <div className="td td-jm">
                    <select
                      value={product.jedinicaMere}
                      onChange={(e) => handleInlineEdit(product.id, 'jedinicaMere', e.target.value)}
                      className="inline-select"
                    >
                      <option value="KOM">KOM</option>
                      <option value="M">M</option>
                      <option value="M2">M²</option>
                      <option value="H">H</option>
                      <option value="PAK">PAK</option>
                    </select>
                  </div>
                  <div className="td td-cena">
                    <div className="cena-input-wrapper">
                      <span className="currency">€</span>
                      <input
                        type="number"
                        value={product.cenaEUR}
                        onChange={(e) => handleInlineEdit(product.id, 'cenaEUR', e.target.value)}
                        className="inline-edit cena-input"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="td td-cena">
                    <span className="cena-display">Дин. {calculateRSD(product.cenaEUR)}</span>
                  </div>
                  <div className="td td-cena">
                    <span className="cena-display markup">€ {calculateMarkup(product.cenaEUR)}</span>
                  </div>
                  <div className="td td-cena">
                    <span className="cena-display markup">Дин. {calculateMarkup(calculateRSD(product.cenaEUR))}</span>
                  </div>
                  <div className="td td-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleOpenModal(product)}
                      title="Izmeni"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(product.id)}
                      title="Obriši"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="cenovnik-stats">
          <div className="stat-item">
            <i className="bi bi-list-check"></i>
            <span>Ukupno usluga: <strong>{products.length}</strong></span>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className="modal modal-cenovnik"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <i className="bi bi-currency-euro"></i>
                    {editingProduct ? 'Izmeni uslugu' : 'Dodaj novu uslugu'}
                  </h2>
                  <button className="modal-close" onClick={handleCloseModal}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Vrsta usluge *</label>
                    <input
                      type="text"
                      value={formData.vrstaUsluge}
                      onChange={(e) => setFormData({ ...formData, vrstaUsluge: e.target.value })}
                      placeholder="npr. Radni sto - 160x60"
                    />
                  </div>

                  <div className="form-group">
                    <label>Opis usluge</label>
                    <textarea
                      value={formData.opisUsluge}
                      onChange={(e) => setFormData({ ...formData, opisUsluge: e.target.value })}
                      placeholder="Detaljniji opis usluge..."
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Jedinica mere</label>
                      <select
                        value={formData.jedinicaMere}
                        onChange={(e) => setFormData({ ...formData, jedinicaMere: e.target.value })}
                      >
                        <option value="KOM">KOM - Komad</option>
                        <option value="M">M - Metar</option>
                        <option value="M2">M² - Kvadratni metar</option>
                        <option value="H">H - Sat</option>
                        <option value="PAK">PAK - Paket</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cena po J.M. (EUR) *</label>
                      <div className="input-with-icon">
                        <span className="input-icon">€</span>
                        <input
                          type="number"
                          value={formData.cenaEUR}
                          onChange={(e) => setFormData({ ...formData, cenaEUR: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.cenaEUR && (
                    <div className="price-preview">
                      <h4>Pregled cena</h4>
                      <div className="preview-grid">
                        <div className="preview-item">
                          <span>Osnovna cena</span>
                          <strong>€ {parseFloat(formData.cenaEUR).toFixed(2)}</strong>
                        </div>
                        <div className="preview-item">
                          <span>Osnovna cena (RSD)</span>
                          <strong>Дин. {calculateRSD(parseFloat(formData.cenaEUR))}</strong>
                        </div>
                        <div className="preview-item highlight">
                          <span>Sa maržom {markup}% (EUR)</span>
                          <strong>€ {calculateMarkup(parseFloat(formData.cenaEUR))}</strong>
                        </div>
                        <div className="preview-item highlight">
                          <span>Sa maržom {markup}% (RSD)</span>
                          <strong>Дин. {calculateMarkup(calculateRSD(parseFloat(formData.cenaEUR)))}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-cancel" onClick={handleCloseModal}>
                    Otkaži
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    <i className="bi bi-check-lg"></i>
                    {editingProduct ? 'Sačuvaj izmene' : 'Dodaj uslugu'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminCenovnik

