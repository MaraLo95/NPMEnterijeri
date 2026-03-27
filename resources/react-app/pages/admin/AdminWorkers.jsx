import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useWorkers } from '../../context/WorkersContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminStyles.css'

const positions = [
  'Stolar',
  'Monter',
  'Dizajner',
  'Majstor',
  'Pomoćni radnik',
  'Vozač',
  'Administrativni radnik'
]

const genderOptions = [
  { id: 'muški', label: 'Muški' },
  { id: 'ženski', label: 'Ženski' }
]

function AdminWorkers() {
  const navigate = useNavigate()
  const { 
    workers, 
    isLoading,
    error,
    isInitialized,
    fetchWorkers,
    addWorker, 
    updateWorker, 
    deleteWorker, 
    toggleWorkerStatus,
    getWorkerStats,
    calculateAge,
    calculateEmploymentDuration 
  } = useWorkers()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [filterPosition, setFilterPosition] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: 'Stolar',
    startDate: '',
    hourlyRate: '',
    gender: 'muški',
    birthDate: '',
    jmbg: '',
    image: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    if (!localStorage.getItem('npm_admin_auth')) {
      navigate('/admin/login')
      return
    }
    if (!isInitialized && !isLoading) {
      fetchWorkers(true)
    }
  }, [navigate, isInitialized, isLoading, fetchWorkers])

  const stats = getWorkerStats()

  const filteredWorkers = workers.filter(worker => {
    const matchesPosition = filterPosition === 'all' || worker.position === filterPosition
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && worker.active) ||
      (filterStatus === 'inactive' && !worker.active)
    const matchesSearch = 
      worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.position.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPosition && matchesStatus && matchesSearch
  })

  const openModal = (worker = null) => {
    if (worker) {
      setEditingWorker(worker)
      setFormData({
        firstName: worker.firstName,
        lastName: worker.lastName,
        position: worker.position,
        startDate: worker.startDate,
        hourlyRate: worker.hourlyRate,
        gender: worker.gender,
        birthDate: worker.birthDate,
        jmbg: worker.jmbg,
        image: worker.image || '',
        phone: worker.phone || '',
        email: worker.email || '',
        address: worker.address || ''
      })
    } else {
      setEditingWorker(null)
      setFormData({
        firstName: '',
        lastName: '',
        position: 'Stolar',
        startDate: new Date().toISOString().split('T')[0],
        hourlyRate: '',
        gender: 'muški',
        birthDate: '',
        jmbg: '',
        image: '',
        phone: '',
        email: '',
        address: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingWorker(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.jmbg) {
      toast.error('Molimo popunite sva obavezna polja')
      return
    }

    if (formData.jmbg.length !== 13) {
      toast.error('JMBG mora imati tačno 13 cifara')
      return
    }

    try {
      if (editingWorker) {
        const updated = await updateWorker(editingWorker.id, formData)
        toast.success('Radnik je uspešno ažuriran!')
        if (selectedWorker?.id === editingWorker.id) {
          setSelectedWorker(updated)
        }
      } else {
        await addWorker(formData)
        toast.success('Radnik je uspešno dodat!')
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Greška pri čuvanju radnika')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog radnika?')) {
      try {
        await deleteWorker(id)
        toast.success('Radnik je obrisan')
        if (selectedWorker?.id === id) {
          setSelectedWorker(null)
        }
      } catch (err) {
        toast.error(err?.message || 'Greška pri brisanju radnika')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    const worker = workers.find(w => w.id === id)
    try {
      const updated = await toggleWorkerStatus(id)
      if (selectedWorker?.id === id) {
        setSelectedWorker(updated)
      }
      toast.success(worker?.active ? 'Radnik je deaktiviran' : 'Radnik je aktiviran')
    } catch (err) {
      toast.error(err?.message || 'Greška pri promeni statusa')
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <AdminLayout>
      <div className="admin-workers">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Radnici</h1>
            <p>Upravljanje zaposlenima i njihovim kartonima</p>
          </div>
          <button className="btn-add" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i>
            Dodaj radnika
          </button>
        </div>

        {/* Stats */}
        <div className="worker-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-text">Ukupno</span>
          </div>
          <div className="stat-item active">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-text">Aktivnih</span>
          </div>
          <div className="stat-item inactive">
            <span className="stat-number">{stats.inactive}</span>
            <span className="stat-text">Neaktivnih</span>
          </div>
        </div>

        {/* Filters */}
        <div className="workers-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pretraži radnike..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="filter-select"
            >
              <option value="all">Sve pozicije</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Svi statusi</option>
              <option value="active">Aktivni</option>
              <option value="inactive">Neaktivni</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-banner" style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => fetchWorkers(true)} style={{ marginLeft: 'auto', padding: '4px 12px' }}>Pokušaj ponovo</button>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="workers-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', animation: 'spin 0.8s linear infinite' }}></i>
              <p>Učitavanje radnika...</p>
            </div>
          </div>
        ) : (
        <>
        {/* Workers Container */}
        <div className="workers-container">
          {/* Workers Grid */}
          <div className="workers-grid">
            <AnimatePresence>
              {filteredWorkers.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  className={`worker-card ${selectedWorker?.id === worker.id ? 'selected' : ''} ${!worker.active ? 'inactive' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="worker-card-header">
                    <div className="worker-avatar">
                      {worker.image ? (
                        <img src={worker.image} alt={`${worker.firstName} ${worker.lastName}`} />
                      ) : (
                        <span>{getInitials(worker.firstName, worker.lastName)}</span>
                      )}
                    </div>
                    <div className={`worker-status-dot ${worker.active ? 'active' : 'inactive'}`}></div>
                  </div>
                  <div className="worker-card-body">
                    <h3>{worker.firstName} {worker.lastName}</h3>
                    <span className="worker-position">{worker.position}</span>
                    <div className="worker-meta">
                      <span><i className="bi bi-calendar3"></i> {calculateEmploymentDuration(worker.startDate)}</span>
                      <span><i className="bi bi-cash"></i> {worker.hourlyRate} RSD/h</span>
                    </div>
                  </div>
                  
                  {/* Status Toggle */}
                  <div className="worker-status-toggle" onClick={(e) => e.stopPropagation()}>
                    <span className="toggle-label">{worker.active ? 'Aktivan' : 'Neaktivan'}</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={worker.active}
                        onChange={() => handleToggleStatus(worker.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="worker-card-actions">
                    <button onClick={(e) => { e.stopPropagation(); openModal(worker); }} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(worker.id); }} title={worker.active ? 'Deaktiviraj' : 'Aktiviraj'}>
                      <i className={`bi bi-${worker.active ? 'pause' : 'play'}-circle`}></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(worker.id); }} title="Obriši" className="delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredWorkers.length === 0 && (
              <div className="empty-state">
                <i className="bi bi-people"></i>
                <h3>Nema radnika</h3>
                <p>Dodajte prvog radnika klikom na dugme iznad.</p>
              </div>
            )}
          </div>

          {/* Worker Details Panel */}
          <AnimatePresence>
            {selectedWorker && (
              <motion.div
                className="worker-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="details-header">
                  <div className="worker-profile">
                    <div className="worker-avatar large">
                      {selectedWorker.image ? (
                        <img src={selectedWorker.image} alt={`${selectedWorker.firstName} ${selectedWorker.lastName}`} />
                      ) : (
                        <span>{getInitials(selectedWorker.firstName, selectedWorker.lastName)}</span>
                      )}
                    </div>
                    <div>
                      <h2>{selectedWorker.firstName} {selectedWorker.lastName}</h2>
                      <span className="worker-position-badge">{selectedWorker.position}</span>
                    </div>
                  </div>
                  <div className="details-actions">
                    <button onClick={() => openModal(selectedWorker)} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={() => setSelectedWorker(null)} title="Zatvori">
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <div className="details-body">
                  <div className="details-section">
                    <h3>Lični podaci</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="bi bi-person"></i>
                        <div>
                          <span>Pol</span>
                          <strong>{selectedWorker.gender === 'muški' ? 'Muški' : 'Ženski'}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-cake2"></i>
                        <div>
                          <span>Datum rođenja</span>
                          <strong>{selectedWorker.birthDate} ({calculateAge(selectedWorker.birthDate)} god.)</strong>
                        </div>
                      </div>
                      <div className="info-item full-width">
                        <i className="bi bi-fingerprint"></i>
                        <div>
                          <span>JMBG</span>
                          <strong>{selectedWorker.jmbg}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Kontakt</h3>
                    <div className="info-grid">
                      {selectedWorker.phone && (
                        <div className="info-item">
                          <i className="bi bi-telephone"></i>
                          <div>
                            <span>Telefon</span>
                            <strong>{selectedWorker.phone}</strong>
                          </div>
                        </div>
                      )}
                      {selectedWorker.email && (
                        <div className="info-item">
                          <i className="bi bi-envelope"></i>
                          <div>
                            <span>E-mail</span>
                            <strong>{selectedWorker.email}</strong>
                          </div>
                        </div>
                      )}
                      {selectedWorker.address && (
                        <div className="info-item full-width">
                          <i className="bi bi-geo-alt"></i>
                          <div>
                            <span>Adresa</span>
                            <strong>{selectedWorker.address}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Podaci o zaposlenju</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="bi bi-briefcase"></i>
                        <div>
                          <span>Radno mesto</span>
                          <strong>{selectedWorker.position}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-calendar-check"></i>
                        <div>
                          <span>Početak zaposlenja</span>
                          <strong>{selectedWorker.startDate}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-clock-history"></i>
                        <div>
                          <span>Trajanje zaposlenja</span>
                          <strong>{calculateEmploymentDuration(selectedWorker.startDate)}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-cash-stack"></i>
                        <div>
                          <span>Satnica</span>
                          <strong>{selectedWorker.hourlyRate} RSD/h</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Status radnika</h3>
                    <div className="status-toggle-section">
                      <div className={`status-badge-large ${selectedWorker.active ? 'active' : 'inactive'}`}>
                        <i className={`bi bi-${selectedWorker.active ? 'check-circle' : 'x-circle'}`}></i>
                        {selectedWorker.active ? 'Aktivan' : 'Neaktivan'}
                      </div>
                      <label className="toggle-switch large">
                        <input
                          type="checkbox"
                          checked={selectedWorker.active}
                          onChange={() => handleToggleStatus(selectedWorker.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    {!selectedWorker.active && (
                      <p className="status-warning">
                        <i className="bi bi-info-circle"></i>
                        Neaktivan radnik ne može biti dodeljen projektima
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>
        )}
      </div>

      {/* Add/Edit Worker Modal */}
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
                  <i className={`bi bi-person-${editingWorker ? 'gear' : 'plus'}`}></i>
                  {editingWorker ? 'Uredi radnika' : 'Dodaj novog radnika'}
                </h2>
                <button className="modal-close" onClick={closeModal}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Photo Upload */}
                  <div className="form-section">
                    <h3>Fotografija</h3>
                    <div className="worker-image-upload">
                      {formData.image ? (
                        <div className="image-preview-worker">
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
                          className="upload-area-worker"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="bi bi-person-bounding-box"></i>
                          <p>Dodaj fotografiju</p>
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
                  </div>

                  {/* Personal Info */}
                  <div className="form-section">
                    <h3>Lični podaci</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Ime *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="Unesite ime"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Prezime *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="Unesite prezime"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Pol</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          {genderOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Datum rođenja</label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>JMBG *</label>
                      <input
                        type="text"
                        value={formData.jmbg}
                        onChange={(e) => setFormData({...formData, jmbg: e.target.value.replace(/\D/g, '').slice(0, 13)})}
                        placeholder="Unesite 13-cifreni JMBG"
                        maxLength={13}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="form-section">
                    <h3>Kontakt podaci</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Telefon</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+381 6X XXX XXXX"
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
                    <div className="form-group">
                      <label>Adresa</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Ulica i broj, grad"
                      />
                    </div>
                  </div>

                  {/* Employment Info */}
                  <div className="form-section">
                    <h3>Podaci o zaposlenju</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Radno mesto</label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                        >
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Početak zaposlenja</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Satnica (RSD/h)</label>
                      <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || ''})}
                        placeholder="npr. 800"
                        min="0"
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
                    {editingWorker ? 'Sačuvaj izmene' : 'Dodaj radnika'}
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

export default AdminWorkers


