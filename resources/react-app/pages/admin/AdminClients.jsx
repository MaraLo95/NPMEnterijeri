import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useClients } from '../../context/ClientsContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminStyles.css'

const categoryOptions = [
  { id: 'kompanija', label: 'Kompanija', icon: 'bi-building' },
  { id: 'fizicko_lice', label: 'Fizičko lice', icon: 'bi-person' }
]

function AdminClients() {
  const navigate = useNavigate()
  const { 
    clients, 
    isLoading,
    error,
    fetchClients,
    addClient, 
    updateClient, 
    deleteClient, 
    getClientStats 
  } = useClients()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    notes: '',
    category: 'fizicko_lice'
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) {
      navigate('/admin/login')
    }
  }, [navigate])

  const stats = getClientStats()

  const filteredClients = clients.filter(client => {
    const matchesCategory = filterCategory === 'all' || client.category === filterCategory
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        companyName: client.companyName,
        address: client.address,
        contactPerson: client.contactPerson,
        phone: client.phone,
        email: client.email || '',
        website: client.website || '',
        notes: client.notes || '',
        category: client.category
      })
    } else {
      setEditingClient(null)
      setFormData({
        companyName: '',
        address: '',
        contactPerson: '',
        phone: '',
        email: '',
        website: '',
        notes: '',
        category: 'fizicko_lice'
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.companyName || !formData.contactPerson || !formData.phone) {
      toast.error('Molimo popunite sva obavezna polja')
      return
    }

    try {
      if (editingClient) {
        const updated = await updateClient(editingClient.id, formData)
        toast.success('Klijent je uspešno ažuriran!')
        if (selectedClient?.id === editingClient.id) {
          setSelectedClient(updated)
        }
      } else {
        const newClient = await addClient(formData)
        toast.success('Klijent je uspešno dodat!')
        setSelectedClient(newClient)
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Greška pri čuvanju klijenta')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog klijenta?')) {
      try {
        await deleteClient(id)
        toast.success('Klijent je obrisan')
        if (selectedClient?.id === id) {
          setSelectedClient(null)
        }
      } catch (err) {
        toast.error(err?.message || 'Greška pri brisanju klijenta')
      }
    }
  }

  const getInitials = (name) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getCategoryIcon = (category) => {
    const cat = categoryOptions.find(c => c.id === category)
    return cat ? cat.icon : 'bi-person'
  }

  const getCategoryLabel = (category) => {
    const cat = categoryOptions.find(c => c.id === category)
    return cat ? cat.label : category
  }

  return (
    <AdminLayout>
      <div className="admin-clients">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Klijenti</h1>
            <p>Upravljanje klijentima i njihovim kartonima</p>
          </div>
          <button className="btn-add" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i>
            Dodaj klijenta
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-banner" style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => fetchClients(true)} style={{ marginLeft: 'auto', padding: '4px 12px' }}>Pokušaj ponovo</button>
          </div>
        )}

        {/* Stats */}
        <div className="client-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-text">Ukupno</span>
          </div>
          <div className="stat-item companies">
            <span className="stat-number">{stats.companies}</span>
            <span className="stat-text">Kompanije</span>
          </div>
          <div className="stat-item individuals">
            <span className="stat-number">{stats.individuals}</span>
            <span className="stat-text">Fizička lica</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="clients-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', animation: 'spin 0.8s linear infinite' }}></i>
              <p>Učitavanje klijenata...</p>
            </div>
          </div>
        ) : (
        <>
        {/* Filters */}
        <div className="clients-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pretraži klijente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={filterCategory === 'all' ? 'active' : ''}
              onClick={() => setFilterCategory('all')}
            >
              Svi ({clients.length})
            </button>
            <button
              className={filterCategory === 'kompanija' ? 'active' : ''}
              onClick={() => setFilterCategory('kompanija')}
            >
              <i className="bi bi-building"></i>
              Kompanije ({stats.companies})
            </button>
            <button
              className={filterCategory === 'fizicko_lice' ? 'active' : ''}
              onClick={() => setFilterCategory('fizicko_lice')}
            >
              <i className="bi bi-person"></i>
              Fizička lica ({stats.individuals})
            </button>
          </div>
        </div>

        {/* Clients Container */}
        <div className="clients-container">
          {/* Clients List */}
          <div className="clients-list">
            <AnimatePresence>
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  className={`client-card ${selectedClient?.id === client.id ? 'selected' : ''}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="client-card-header">
                    <div className={`client-avatar ${client.category}`}>
                      <i className={`bi ${getCategoryIcon(client.category)}`}></i>
                    </div>
                    <div className="client-main-info">
                      <h3>{client.companyName}</h3>
                      <span className="client-category-badge">
                        {getCategoryLabel(client.category)}
                      </span>
                    </div>
                  </div>
                  <div className="client-card-body">
                    <div className="client-info-row">
                      <i className="bi bi-person"></i>
                      <span>{client.contactPerson}</span>
                    </div>
                    <div className="client-info-row">
                      <i className="bi bi-telephone"></i>
                      <span>{client.phone}</span>
                    </div>
                    <div className="client-info-row">
                      <i className="bi bi-geo-alt"></i>
                      <span>{client.address}</span>
                    </div>
                  </div>
                  <div className="client-card-actions">
                    <button onClick={(e) => { e.stopPropagation(); openModal(client); }} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }} title="Obriši" className="delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredClients.length === 0 && (
              <div className="empty-state">
                <i className="bi bi-people"></i>
                <h3>Nema klijenata</h3>
                <p>Dodajte prvog klijenta klikom na dugme iznad.</p>
              </div>
            )}
          </div>

          {/* Client Details Panel */}
          <AnimatePresence>
            {selectedClient && (
              <motion.div
                className="client-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="details-header">
                  <div className="client-profile">
                    <div className={`client-avatar large ${selectedClient.category}`}>
                      <i className={`bi ${getCategoryIcon(selectedClient.category)}`}></i>
                    </div>
                    <div>
                      <h2>{selectedClient.companyName}</h2>
                      <span className="client-category-badge">
                        {getCategoryLabel(selectedClient.category)}
                      </span>
                    </div>
                  </div>
                  <div className="details-actions">
                    <button onClick={() => openModal(selectedClient)} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={() => setSelectedClient(null)} title="Zatvori">
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <div className="details-body">
                  <div className="details-section">
                    <h3>Kontakt osoba</h3>
                    <div className="info-grid">
                      <div className="info-item full-width">
                        <i className="bi bi-person-badge"></i>
                        <div>
                          <span>Ime i prezime</span>
                          <strong>{selectedClient.contactPerson}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Kontakt podaci</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="bi bi-telephone"></i>
                        <div>
                          <span>Telefon</span>
                          <strong>{selectedClient.phone}</strong>
                        </div>
                      </div>
                      {selectedClient.email && (
                        <div className="info-item">
                          <i className="bi bi-envelope"></i>
                          <div>
                            <span>E-mail</span>
                            <strong>{selectedClient.email}</strong>
                          </div>
                        </div>
                      )}
                      {selectedClient.website && (
                        <div className="info-item">
                          <i className="bi bi-globe"></i>
                          <div>
                            <span>Web sajt</span>
                            <strong>{selectedClient.website}</strong>
                          </div>
                        </div>
                      )}
                      <div className="info-item full-width">
                        <i className="bi bi-geo-alt"></i>
                        <div>
                          <span>Adresa</span>
                          <strong>{selectedClient.address}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedClient.notes && (
                    <div className="details-section">
                      <h3>Napomene</h3>
                      <p className="notes-text">{selectedClient.notes}</p>
                    </div>
                  )}

                  <div className="details-section">
                    <h3>Informacije</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="bi bi-calendar3"></i>
                        <div>
                          <span>Dodat</span>
                          <strong>{selectedClient.createdAt}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>
        )}
      </div>

      {/* Add/Edit Client Modal */}
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
              className="modal modal-large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <i className={`bi bi-${editingClient ? 'pencil-square' : 'person-plus'}`}></i>
                  {editingClient ? 'Uredi klijenta' : 'Dodaj novog klijenta'}
                </h2>
                <button className="modal-close" onClick={closeModal}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Category Selection */}
                  <div className="form-section">
                    <h3>Tip klijenta</h3>
                    <div className="category-select">
                      {categoryOptions.map(cat => (
                        <div 
                          key={cat.id}
                          className={`category-option ${formData.category === cat.id ? 'selected' : ''}`}
                          onClick={() => setFormData({...formData, category: cat.id})}
                        >
                          <i className={`bi ${cat.icon}`}></i>
                          <span>{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="form-section">
                    <h3>Osnovni podaci</h3>
                    <div className="form-group">
                      <label>{formData.category === 'kompanija' ? 'Naziv kompanije *' : 'Ime i prezime *'}</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder={formData.category === 'kompanija' ? 'npr. TechSoft d.o.o.' : 'npr. Marko Petrović'}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Adresa *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Ulica i broj, grad"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="form-section">
                    <h3>Kontakt podaci</h3>
                    <div className="form-group">
                      <label>Kontakt osoba *</label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        placeholder="Ime i prezime kontakt osobe"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Telefon *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+381 6X XXX XXXX"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>E-mail</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    {formData.category === 'kompanija' && (
                      <div className="form-group">
                        <label>Web sajt</label>
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="www.example.com"
                        />
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="form-section">
                    <h3>Dodatne informacije</h3>
                    <div className="form-group">
                      <label>Napomene</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Dodatne napomene o klijentu..."
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Otkaži
                  </button>
                  <button type="submit" className="btn-save">
                    <i className="bi bi-check-lg"></i>
                    {editingClient ? 'Sačuvaj izmene' : 'Dodaj klijenta'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminClients


