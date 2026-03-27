import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useProjects } from '../../context/ProjectsContext'
import { useWorkers } from '../../context/WorkersContext'
import { useClients } from '../../context/ClientsContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminStyles.css'

const projectTypes = {
  kuhinja: 'Kuhinja',
  plakar: 'Plakar',
  soba: 'Soba',
  kancelarija: 'Kancelarija',
  montaza: 'Montaža',
  ostalo: 'Ostalo'
}

const statusOptions = [
  { id: 'novi', label: 'Novi', color: 'blue' },
  { id: 'u_toku', label: 'U toku', color: 'orange' },
  { id: 'zavrsen', label: 'Završen', color: 'green' },
  { id: 'otkazan', label: 'Otkazan', color: 'red' }
]

const priorityOptions = [
  { id: 'high', label: 'Visok', color: 'red' },
  { id: 'medium', label: 'Srednji', color: 'orange' },
  { id: 'low', label: 'Nizak', color: 'green' }
]

function AdminProjects() {
  const navigate = useNavigate()
  const { projects, isLoading, error, fetchProjects, addProject, updateProject, deleteProject, changeProjectStatus, addRadnikToProject, removeRadnikFromProject, getProjectStats } = useProjects()
  const { workers, isInitialized: workersInit, isLoading: workersLoading, fetchWorkers, getActiveWorkers } = useWorkers()
  const { clients } = useClients()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    client: '',
    email: '',
    phone: '',
    type: 'kuhinja',
    status: 'novi',
    priority: 'medium',
    startDate: '',
    deadline: '',
    budget: '',
    description: '',
    notes: '',
    progress: 0,
    assignedWorkers: [],
    images: [],
    documents: []
  })

  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false)
  const [filesModalProject, setFilesModalProject] = useState(null)
  const [activeFileTab, setActiveFileTab] = useState('images')

  const activeWorkers = getActiveWorkers()

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) {
      navigate('/admin/login')
      return
    }
    if (!workersInit && !workersLoading) fetchWorkers(true)
  }, [navigate, workersInit, workersLoading, fetchWorkers])

  const stats = getProjectStats()

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData({ 
        ...project, 
        clientId: project.clientId || '', 
        assignedWorkers: project.assignedWorkers || [],
        images: project.images || [],
        documents: project.documents || []
      })
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        clientId: '',
        client: '',
        email: '',
        phone: '',
        type: 'kuhinja',
        status: 'novi',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        budget: '',
        description: '',
        notes: '',
        progress: 0,
        assignedWorkers: [],
        images: [],
        documents: []
      })
    }
    setIsModalOpen(true)
  }

  const openFilesModal = (project) => {
    setFilesModalProject(project)
    setActiveFileTab('images')
    setIsFilesModalOpen(true)
  }

  const handleFileUpload = (e, fileType, isModal = false) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      const isImage = file.type.startsWith('image/')
      const isPDF = file.type === 'application/pdf'
      
      if (fileType === 'image' && !isImage) {
        toast.error('Samo slike su dozvoljene')
        return
      }
      
      if (fileType === 'document' && !isPDF) {
        toast.error('Samo PDF dokumenti su dozvoljeni')
        return
      }
      
      const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error(`Maksimalna veličina je ${fileType === 'image' ? '5MB' : '20MB'}`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const newFile = {
          id: Date.now() + Math.random(),
          url: reader.result,
          name: file.name,
          type: fileType,
          size: file.size,
          uploadedAt: new Date().toISOString()
        }

        if (isModal && filesModalProject) {
          if (fileType === 'image') {
            const updatedImages = [...(filesModalProject.images || []), newFile]
            updateProject(filesModalProject.id, { images: updatedImages })
            const updatedProject = { ...filesModalProject, images: updatedImages }
            setFilesModalProject(updatedProject)
            // Also update selectedProject so the details panel refreshes
            if (selectedProject && selectedProject.id === filesModalProject.id) {
              setSelectedProject(updatedProject)
            }
          } else {
            const updatedDocs = [...(filesModalProject.documents || []), newFile]
            updateProject(filesModalProject.id, { documents: updatedDocs })
            const updatedProject = { ...filesModalProject, documents: updatedDocs }
            setFilesModalProject(updatedProject)
            // Also update selectedProject so the details panel refreshes
            if (selectedProject && selectedProject.id === filesModalProject.id) {
              setSelectedProject(updatedProject)
            }
          }
          toast.success(fileType === 'image' ? 'Slika je dodata!' : 'Dokument je dodat!')
        } else {
          if (fileType === 'image') {
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), newFile]
            }))
          } else {
            setFormData(prev => ({
              ...prev,
              documents: [...(prev.documents || []), newFile]
            }))
          }
        }
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const removeFile = (fileId, fileType, isModal = false) => {
    if (isModal && filesModalProject) {
      if (fileType === 'image') {
        const updatedImages = filesModalProject.images.filter(img => img.id !== fileId)
        updateProject(filesModalProject.id, { images: updatedImages })
        const updatedProject = { ...filesModalProject, images: updatedImages }
        setFilesModalProject(updatedProject)
        // Also update selectedProject so the details panel refreshes
        if (selectedProject && selectedProject.id === filesModalProject.id) {
          setSelectedProject(updatedProject)
        }
      } else {
        const updatedDocs = filesModalProject.documents.filter(doc => doc.id !== fileId)
        updateProject(filesModalProject.id, { documents: updatedDocs })
        const updatedProject = { ...filesModalProject, documents: updatedDocs }
        setFilesModalProject(updatedProject)
        // Also update selectedProject so the details panel refreshes
        if (selectedProject && selectedProject.id === filesModalProject.id) {
          setSelectedProject(updatedProject)
        }
      }
      toast.success(fileType === 'image' ? 'Slika je uklonjena' : 'Dokument je uklonjen')
    } else {
      if (fileType === 'image') {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => img.id !== fileId)
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          documents: prev.documents.filter(doc => doc.id !== fileId)
        }))
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleWorkerToggle = (workerId) => {
    const currentWorkers = formData.assignedWorkers || []
    if (currentWorkers.includes(workerId)) {
      setFormData({
        ...formData,
        assignedWorkers: currentWorkers.filter(id => id !== workerId)
      })
    } else {
      setFormData({
        ...formData,
        assignedWorkers: [...currentWorkers, workerId]
      })
    }
  }

  const getWorkerById = (id) => {
    return workers.find(w => w.id === id)
  }

  const getClientById = (id) => {
    return clients.find(c => c.id === id)
  }

  const handleClientSelect = (clientId) => {
    if (clientId === '') {
      setFormData({
        ...formData,
        clientId: '',
        client: '',
        email: '',
        phone: ''
      })
    } else {
      const selectedClient = clients.find(c => c.id === parseInt(clientId))
      if (selectedClient) {
        setFormData({
          ...formData,
          clientId: selectedClient.id,
          client: selectedClient.companyName || selectedClient.contactPerson,
          email: selectedClient.email || '',
          phone: selectedClient.phone || ''
        })
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.clientId) {
      toast.error('Molimo unesite naziv projekta i izaberite klijenta')
      return
    }

    try {
      let savedProject
      if (editingProject) {
        savedProject = await updateProject(editingProject.id, formData)
        const currentIds = editingProject.assignedWorkers || []
        const newIds = formData.assignedWorkers || []
        for (const rid of newIds) {
          if (!currentIds.includes(rid)) {
            savedProject = await addRadnikToProject(editingProject.id, rid)
          }
        }
        for (const rid of currentIds) {
          if (!newIds.includes(rid)) {
            savedProject = await removeRadnikFromProject(editingProject.id, rid)
          }
        }
        toast.success('Projekat je uspešno ažuriran!')
        if (selectedProject?.id === editingProject.id) {
          setSelectedProject(savedProject)
        }
      } else {
        savedProject = await addProject(formData)
        for (const rid of (formData.assignedWorkers || [])) {
          savedProject = await addRadnikToProject(savedProject.id, rid)
        }
        toast.success('Projekat je uspešno kreiran!')
        setSelectedProject(savedProject)
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Greška pri čuvanju projekta')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj projekat?')) {
      try {
        await deleteProject(id)
        toast.success('Projekat je obrisan')
        if (selectedProject?.id === id) {
          setSelectedProject(null)
        }
      } catch (err) {
        toast.error(err?.message || 'Greška pri brisanju projekta')
      }
    }
  }

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const updated = await changeProjectStatus(projectId, newStatus)
      toast.success('Status projekta je ažuriran')
      if (selectedProject?.id === projectId) {
        setSelectedProject(updated)
      }
    } catch (err) {
      toast.error(err?.message || 'Greška pri promeni statusa')
    }
  }

  const handleProgressChange = async (projectId, newProgress) => {
    try {
      const proj = projects.find(p => p.id === projectId)
      if (proj) {
        await updateProject(projectId, { progress: parseInt(newProgress) })
        if (selectedProject?.id === projectId) {
          setSelectedProject({ ...selectedProject, progress: parseInt(newProgress) })
        }
      }
    } catch (err) {
      toast.error(err?.message || 'Greška pri promeni napretka')
    }
  }

  return (
    <AdminLayout>
      <div className="admin-projects">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Upravljanje projektima</h1>
            <p>Kreirajte, pratite i upravljajte svim projektima</p>
          </div>
          <button className="btn-add" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i>
            Novi projekat
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-banner" style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => fetchProjects(true)} style={{ marginLeft: 'auto', padding: '4px 12px' }}>Pokušaj ponovo</button>
          </div>
        )}

        {/* Stats */}
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-text">Ukupno</span>
          </div>
          <div className="stat-item active">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-text">Aktivnih</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-text">Završenih</span>
          </div>
          <div className="stat-item cancelled">
            <span className="stat-number">{stats.cancelled}</span>
            <span className="stat-text">Otkazanih</span>
          </div>
        </div>

        {/* Filters */}
        <div className="projects-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pretraži projekte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={filterStatus === 'all' ? 'active' : ''}
              onClick={() => setFilterStatus('all')}
            >
              Svi ({projects.length})
            </button>
            {statusOptions.map(status => (
              <button
                key={status.id}
                className={`${filterStatus === status.id ? 'active' : ''} ${status.color}`}
                onClick={() => setFilterStatus(status.id)}
              >
                {status.label} ({projects.filter(p => p.status === status.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-container">
          <div className="projects-list">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`project-list-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-list-header">
                    <span className={`status-badge ${statusOptions.find(s => s.id === project.status)?.color}`}>
                      {statusOptions.find(s => s.id === project.status)?.label}
                    </span>
                    <span className={`priority-badge ${priorityOptions.find(p => p.id === project.priority)?.color}`}>
                      {priorityOptions.find(p => p.id === project.priority)?.label}
                    </span>
                  </div>
                  <h4>{project.title}</h4>
                  <div className="project-list-meta">
                    <span><i className="bi bi-person"></i> {project.client}</span>
                    <span><i className="bi bi-tag"></i> {projectTypes[project.type]}</span>
                  </div>
                  <div className="project-list-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="empty-state small">
                <i className="bi bi-folder-x"></i>
                <p>Nema projekata</p>
              </div>
            )}
          </div>

          {/* Project Details Panel */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                className="project-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="details-header">
                  <h2>{selectedProject.title}</h2>
                  <div className="details-actions">
                    <button onClick={() => openFilesModal(selectedProject)} title="Fajlovi" className="images">
                      <i className="bi bi-folder2"></i>
                    </button>
                    <button onClick={() => openModal(selectedProject)} title="Uredi">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button onClick={() => handleDelete(selectedProject.id)} title="Obriši" className="delete">
                      <i className="bi bi-trash"></i>
                    </button>
                    <button onClick={() => setSelectedProject(null)} title="Zatvori">
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <div className="details-body">
                  <div className="details-section">
                    <h3>Status projekta</h3>
                    <div className="status-selector">
                      {statusOptions.map(status => (
                        <button
                          key={status.id}
                          className={`${status.color} ${selectedProject.status === status.id ? 'active' : ''}`}
                          onClick={() => handleStatusChange(selectedProject.id, status.id)}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Napredak</h3>
                    <div className="progress-control">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedProject.progress}
                        onChange={(e) => handleProgressChange(selectedProject.id, e.target.value)}
                      />
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="progress-bar large">
                      <div className="progress-fill" style={{ width: `${selectedProject.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Informacije o klijentu</h3>
                    <div className="info-grid">
                      {selectedProject.clientId && getClientById(selectedProject.clientId) && (
                        <div className="info-item full-width linked-client">
                          <i className={`bi bi-${getClientById(selectedProject.clientId).category === 'kompanija' ? 'building' : 'person'}`}></i>
                          <div>
                            <span>Kompanija / Klijent</span>
                            <strong>{getClientById(selectedProject.clientId).companyName}</strong>
                          </div>
                        </div>
                      )}
                      <div className="info-item">
                        <i className="bi bi-person"></i>
                        <div>
                          <span>Kontakt osoba</span>
                          <strong>{selectedProject.client}</strong>
                        </div>
                      </div>
                      {selectedProject.email && (
                        <div className="info-item">
                          <i className="bi bi-envelope"></i>
                          <div>
                            <span>E-mail</span>
                            <strong>{selectedProject.email}</strong>
                          </div>
                        </div>
                      )}
                      {selectedProject.phone && (
                        <div className="info-item">
                          <i className="bi bi-telephone"></i>
                          <div>
                            <span>Telefon</span>
                            <strong>{selectedProject.phone}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Detalji projekta</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="bi bi-tag"></i>
                        <div>
                          <span>Tip</span>
                          <strong>{projectTypes[selectedProject.type]}</strong>
                        </div>
                      </div>
                      {selectedProject.budget && (
                        <div className="info-item">
                          <i className="bi bi-cash"></i>
                          <div>
                            <span>Budžet</span>
                            <strong>{parseInt(selectedProject.budget).toLocaleString()} RSD</strong>
                          </div>
                        </div>
                      )}
                      {selectedProject.startDate && (
                        <div className="info-item">
                          <i className="bi bi-calendar"></i>
                          <div>
                            <span>Početak</span>
                            <strong>{selectedProject.startDate}</strong>
                          </div>
                        </div>
                      )}
                      {selectedProject.deadline && (
                        <div className="info-item">
                          <i className="bi bi-calendar-check"></i>
                          <div>
                            <span>Rok</span>
                            <strong>{selectedProject.deadline}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedProject.description && (
                    <div className="details-section">
                      <h3>Opis</h3>
                      <p className="description-text">{selectedProject.description}</p>
                    </div>
                  )}

                  {selectedProject.notes && (
                    <div className="details-section">
                      <h3>Napomene</h3>
                      <p className="notes-text">{selectedProject.notes}</p>
                    </div>
                  )}

                  {/* Project Files Section */}
                  <div className="details-section">
                    <div className="section-header-with-action">
                      <h3>Slike i dokumenti</h3>
                      <button 
                        className="add-images-inline-btn"
                        onClick={() => openFilesModal(selectedProject)}
                      >
                        <i className="bi bi-plus"></i>
                        Upravljaj
                      </button>
                    </div>
                    
                    {/* Images Preview */}
                    {selectedProject.images && selectedProject.images.length > 0 && (
                      <div className="files-preview-section">
                        <span className="files-preview-label">
                          <i className="bi bi-images"></i> Slike ({selectedProject.images.length})
                        </span>
                        <div className="project-images-preview">
                          {selectedProject.images.slice(0, 4).map(image => (
                            <div key={image.id} className="image-preview-item">
                              <img src={image.url} alt={image.name || 'Project image'} />
                            </div>
                          ))}
                          {selectedProject.images.length > 4 && (
                            <div className="image-preview-more" onClick={() => openFilesModal(selectedProject)}>
                              +{selectedProject.images.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Documents Preview */}
                    {selectedProject.documents && selectedProject.documents.length > 0 && (
                      <div className="files-preview-section">
                        <span className="files-preview-label">
                          <i className="bi bi-file-pdf"></i> Dokumenti ({selectedProject.documents.length})
                        </span>
                        <div className="documents-preview-list">
                          {selectedProject.documents.slice(0, 3).map(doc => (
                            <a 
                              key={doc.id} 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="document-preview-item"
                            >
                              <i className="bi bi-file-pdf"></i>
                              <span className="doc-name">{doc.name}</span>
                              <i className="bi bi-download"></i>
                            </a>
                          ))}
                          {selectedProject.documents.length > 3 && (
                            <button className="view-more-docs" onClick={() => openFilesModal(selectedProject)}>
                              Pogledaj sve ({selectedProject.documents.length})
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {(!selectedProject.images || selectedProject.images.length === 0) && 
                     (!selectedProject.documents || selectedProject.documents.length === 0) && (
                      <div className="no-images-placeholder">
                        <i className="bi bi-folder2-open"></i>
                        <p>Nema fajlova za ovaj projekat</p>
                        <button onClick={() => openFilesModal(selectedProject)}>
                          <i className="bi bi-plus-lg"></i>
                          Dodaj slike ili dokumente
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="details-section">
                    <h3>Dodeljeni radnici</h3>
                    {selectedProject.assignedWorkers && selectedProject.assignedWorkers.length > 0 ? (
                      <div className="assigned-workers-list">
                        {selectedProject.assignedWorkers.map(workerId => {
                          const worker = getWorkerById(workerId)
                          if (!worker) return null
                          return (
                            <div key={workerId} className="assigned-worker-item">
                              <div className="assigned-worker-avatar">
                                {worker.image ? (
                                  <img src={worker.image} alt={`${worker.firstName} ${worker.lastName}`} />
                                ) : (
                                  <span>{worker.firstName.charAt(0)}{worker.lastName.charAt(0)}</span>
                                )}
                              </div>
                              <div className="assigned-worker-info">
                                <span className="assigned-worker-name">{worker.firstName} {worker.lastName}</span>
                                <span className="assigned-worker-position">{worker.position}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="no-workers-assigned">Nema dodeljenih radnika</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create/Edit Project Modal */}
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
                  <i className={`bi bi-folder-${editingProject ? 'check' : 'plus'}`}></i>
                  {editingProject ? 'Uredi projekat' : 'Novi projekat'}
                </h2>
                <button className="modal-close" onClick={closeModal}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-section">
                    <h3>Osnovne informacije</h3>
                    <div className="form-group">
                      <label>Naziv projekta *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="npr. Kuhinja po meri - Porodica Petrović"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tip projekta</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                          {Object.entries(projectTypes).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prioritet</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                          {priorityOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editingProject && (
                      <div className="form-row">
                        <div className="form-group">
                          <label>Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Napredak (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h3>Podaci o klijentu</h3>
                    <div className="form-group">
                      <label>Izaberite klijenta iz baze</label>
                      <select
                        value={formData.clientId || ''}
                        onChange={(e) => handleClientSelect(e.target.value)}
                        className="client-select"
                      >
                        <option value="">-- Izaberite klijenta ili unesite ručno --</option>
                        {clients.length > 0 && (
                          <>
                            <optgroup label="Kompanije">
                              {clients.filter(c => c.category === 'kompanija').map(client => (
                                <option key={client.id} value={client.id}>
                                  {client.companyName} ({client.contactPerson})
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Fizička lica">
                              {clients.filter(c => c.category === 'fizicko_lice').map(client => (
                                <option key={client.id} value={client.id}>
                                  {client.companyName} ({client.contactPerson})
                                </option>
                              ))}
                            </optgroup>
                          </>
                        )}
                      </select>
                    </div>
                    {formData.clientId && (
                      <div className="selected-client-info">
                        <i className="bi bi-info-circle"></i>
                        <span>Podaci će biti popunjeni iz kartona klijenta</span>
                      </div>
                    )}
                    <div className="form-group">
                      <label>Kontakt osoba *</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                        placeholder="Ime i prezime kontakt osobe"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>E-mail</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefon</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+381 6X XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Rokovi i budžet</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Datum početka *</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Rok završetka</label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Budžet (RSD)</label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Detalji</h3>
                    <div className="form-group">
                      <label>Opis projekta</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Opišite zahteve klijenta..."
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Napomene</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Dodatne napomene..."
                        rows="2"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Slike projekta</h3>
                    <div className="project-images-upload">
                      <label className="image-upload-btn">
                        <i className="bi bi-image"></i>
                        <span>Dodaj slike</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'image', false)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span className="upload-hint">Max 5MB po slici. JPG, PNG, WEBP</span>
                    </div>
                    
                    {formData.images && formData.images.length > 0 && (
                      <div className="project-images-grid">
                        {formData.images.map(image => (
                          <div key={image.id} className="project-image-item">
                            <img src={image.url} alt={image.name} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeFile(image.id, 'image', false)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h3>PDF Dokumenti</h3>
                    <div className="project-images-upload">
                      <label className="image-upload-btn pdf">
                        <i className="bi bi-file-pdf"></i>
                        <span>Dodaj PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'document', false)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span className="upload-hint">Max 20MB po dokumentu. Samo PDF format.</span>
                    </div>
                    
                    {formData.documents && formData.documents.length > 0 && (
                      <div className="project-documents-list">
                        {formData.documents.map(doc => (
                          <div key={doc.id} className="project-document-item">
                            <i className="bi bi-file-pdf"></i>
                            <div className="doc-info">
                              <span className="doc-name">{doc.name}</span>
                              <span className="doc-size">{formatFileSize(doc.size)}</span>
                            </div>
                            <button
                              type="button"
                              className="remove-doc-btn"
                              onClick={() => removeFile(doc.id, 'document', false)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h3>Dodeli radnike</h3>
                    {activeWorkers.length > 0 ? (
                      <div className="workers-select-grid">
                        {activeWorkers.map(worker => (
                          <div 
                            key={worker.id}
                            className={`worker-select-item ${(formData.assignedWorkers || []).includes(worker.id) ? 'selected' : ''}`}
                            onClick={() => handleWorkerToggle(worker.id)}
                          >
                            <div className="worker-select-avatar">
                              {worker.image ? (
                                <img src={worker.image} alt={`${worker.firstName} ${worker.lastName}`} />
                              ) : (
                                <span>{worker.firstName.charAt(0)}{worker.lastName.charAt(0)}</span>
                              )}
                            </div>
                            <div className="worker-select-info">
                              <span className="worker-select-name">{worker.firstName} {worker.lastName}</span>
                              <span className="worker-select-position">{worker.position}</span>
                            </div>
                            <div className="worker-select-check">
                              <i className={`bi bi-${(formData.assignedWorkers || []).includes(worker.id) ? 'check-circle-fill' : 'circle'}`}></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-workers-text">Nema aktivnih radnika. Dodajte radnike u sekciji Radnici.</p>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Otkaži
                  </button>
                  <button type="submit" className="btn-save">
                    <i className="bi bi-check-lg"></i>
                    {editingProject ? 'Sačuvaj izmene' : 'Kreiraj projekat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files Modal for existing projects - Images & Documents */}
      <AnimatePresence>
        {isFilesModalOpen && filesModalProject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilesModalOpen(false)}
          >
            <motion.div
              className="modal files-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <i className="bi bi-folder2-open"></i>
                  Fajlovi projekta
                </h2>
                <button className="modal-close" onClick={() => setIsFilesModalOpen(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="image-modal-project-title">
                  <i className="bi bi-folder2-open"></i>
                  {filesModalProject.title}
                </div>

                {/* Tabs */}
                <div className="files-tabs">
                  <button 
                    className={`files-tab ${activeFileTab === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveFileTab('images')}
                  >
                    <i className="bi bi-images"></i>
                    Slike ({filesModalProject.images?.length || 0})
                  </button>
                  <button 
                    className={`files-tab ${activeFileTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveFileTab('documents')}
                  >
                    <i className="bi bi-file-pdf"></i>
                    Dokumenti ({filesModalProject.documents?.length || 0})
                  </button>
                </div>

                {/* Images Tab */}
                {activeFileTab === 'images' && (
                  <>
                    <div className="project-images-upload centered">
                      <label className="image-upload-btn large">
                        <i className="bi bi-image"></i>
                        <span>Dodaj nove slike</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'image', true)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span className="upload-hint">Max 5MB po slici. JPG, PNG, WEBP</span>
                    </div>

                    {filesModalProject.images && filesModalProject.images.length > 0 ? (
                      <div className="image-modal-grid">
                        {filesModalProject.images.map(image => (
                          <div key={image.id} className="image-modal-item">
                            <img src={image.url} alt={image.name || 'Project image'} />
                            <div className="image-modal-overlay">
                              <button
                                className="remove-image-modal-btn"
                                onClick={() => removeFile(image.id, 'image', true)}
                              >
                                <i className="bi bi-trash"></i>
                                Obriši
                              </button>
                            </div>
                            <span className="image-name">{image.name || 'Slika'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-images-state">
                        <i className="bi bi-image"></i>
                        <p>Još uvek nema slika za ovaj projekat</p>
                        <span>Kliknite na dugme iznad da dodate prvu sliku</span>
                      </div>
                    )}
                  </>
                )}

                {/* Documents Tab */}
                {activeFileTab === 'documents' && (
                  <>
                    <div className="project-images-upload centered">
                      <label className="image-upload-btn large pdf">
                        <i className="bi bi-file-pdf"></i>
                        <span>Dodaj PDF dokumente</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'document', true)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span className="upload-hint">Max 20MB po dokumentu. Samo PDF format.</span>
                    </div>

                    {filesModalProject.documents && filesModalProject.documents.length > 0 ? (
                      <div className="documents-modal-list">
                        {filesModalProject.documents.map(doc => (
                          <div key={doc.id} className="document-modal-item">
                            <div className="doc-icon">
                              <i className="bi bi-file-pdf"></i>
                            </div>
                            <div className="doc-details">
                              <span className="doc-name">{doc.name}</span>
                              <span className="doc-meta">
                                {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString('sr-Latn-RS')}
                              </span>
                            </div>
                            <div className="doc-actions">
                              <a 
                                href={doc.url} 
                                download={doc.name}
                                className="doc-action-btn download"
                                title="Preuzmi"
                              >
                                <i className="bi bi-download"></i>
                              </a>
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="doc-action-btn view"
                                title="Otvori"
                              >
                                <i className="bi bi-eye"></i>
                              </a>
                              <button
                                className="doc-action-btn delete"
                                onClick={() => removeFile(doc.id, 'document', true)}
                                title="Obriši"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-images-state">
                        <i className="bi bi-file-pdf"></i>
                        <p>Još uvek nema dokumenata za ovaj projekat</p>
                        <span>Kliknite na dugme iznad da dodate prvi dokument</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <span className="image-count">
                  <i className="bi bi-folder2"></i>
                  {(filesModalProject.images?.length || 0) + (filesModalProject.documents?.length || 0)} fajlova ukupno
                </span>
                <button className="btn-save" onClick={() => setIsFilesModalOpen(false)}>
                  <i className="bi bi-check-lg"></i>
                  Gotovo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminProjects


