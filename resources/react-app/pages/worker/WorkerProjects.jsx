import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '../../context/ProjectsContext'
import { useWorkers } from '../../context/WorkersContext'
import { useClients } from '../../context/ClientsContext'
import WorkerLayout from '../../components/worker/WorkerLayout'
import './WorkerStyles.css'

const statusLabels = {
  novi: 'Novi',
  u_toku: 'U toku',
  zavrsen: 'Završen',
  otkazan: 'Otkazan'
}

const statusColors = {
  novi: 'blue',
  u_toku: 'orange',
  zavrsen: 'green',
  otkazan: 'red'
}

const projectTypes = {
  kuhinja: 'Kuhinja',
  plakar: 'Plakar',
  soba: 'Soba',
  kancelarija: 'Kancelarija',
  montaza: 'Montaža',
  ostalo: 'Ostalo'
}

function WorkerProjects() {
  const { projects } = useProjects()
  const { workers, isInitialized, isLoading, fetchWorkers } = useWorkers()
  const { clients } = useClients()
  const [currentWorker, setCurrentWorker] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!isInitialized && !isLoading) fetchWorkers(true)
  }, [isInitialized, isLoading, fetchWorkers])

  useEffect(() => {
    const workerId = localStorage.getItem('npm_worker_id')
    if (workerId) {
      const worker = workers.find(w => w.id === parseInt(workerId))
      if (worker) {
        setCurrentWorker(worker)
      }
    }
  }, [workers])

  // Show all projects (not just assigned ones)
  const allProjects = projects

  const filteredProjects = allProjects.filter(project => {
    if (filterStatus === 'all') return true
    return project.status === filterStatus
  })

  const getClientById = (id) => clients.find(c => c.id === id)

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusCount = (status) => {
    return allProjects.filter(p => p.status === status).length
  }

  return (
    <WorkerLayout>
      <div className="worker-page">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="page-title">
            <h1>Projekti</h1>
            <p>Pregled svih aktivnih projekata</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="project-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="bi bi-folder2"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{allProjects.length}</span>
              <span className="stat-label">Ukupno projekata</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="bi bi-play-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{getStatusCount('u_toku')}</span>
              <span className="stat-label">U toku</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{getStatusCount('zavrsen')}</span>
              <span className="stat-label">Završeni</span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="filters-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Svi ({allProjects.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'u_toku' ? 'active' : ''}`}
            onClick={() => setFilterStatus('u_toku')}
          >
            U toku ({getStatusCount('u_toku')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'novi' ? 'active' : ''}`}
            onClick={() => setFilterStatus('novi')}
          >
            Novi ({getStatusCount('novi')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'zavrsen' ? 'active' : ''}`}
            onClick={() => setFilterStatus('zavrsen')}
          >
            Završeni ({getStatusCount('zavrsen')})
          </button>
        </motion.div>

        {/* Projects Grid */}
        <div className="projects-layout">
          <motion.div
            className="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-folder2-open"></i>
                <h3>Nema projekata</h3>
                <p>
                  {filterStatus === 'all' 
                    ? 'Trenutno nema aktivnih projekata.'
                    : 'Nema projekata sa ovim statusom.'
                  }
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-card-header">
                    <span className={`status-badge ${statusColors[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                    <span className="project-type">{projectTypes[project.type] || project.type}</span>
                  </div>
                  
                  <h3 className="project-title">{project.title}</h3>
                  
                  <div className="project-meta">
                    <div className="meta-item">
                      <i className="bi bi-person"></i>
                      <span>{project.client}</span>
                    </div>
                    {project.deadline && (
                      <div className="meta-item">
                        <i className="bi bi-calendar"></i>
                        <span>{formatDate(project.deadline)}</span>
                      </div>
                    )}
                  </div>

                  <div className="project-progress">
                    <div className="progress-header">
                      <span>Napredak</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Project Details Panel */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                className="project-details-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="panel-header">
                  <h3>Detalji projekta</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedProject(null)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="panel-content">
                  <div className="detail-section">
                    <span className={`status-badge large ${statusColors[selectedProject.status]}`}>
                      {statusLabels[selectedProject.status]}
                    </span>
                    <h2>{selectedProject.title}</h2>
                    <span className="project-type-badge">
                      {projectTypes[selectedProject.type] || selectedProject.type}
                    </span>
                  </div>

                  <div className="detail-section">
                    <h4>Napredak projekta</h4>
                    <div className="progress-large">
                      <div className="progress-circle">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" className="progress-bg" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            className="progress-value"
                            style={{ 
                              strokeDasharray: `${(selectedProject.progress || 0) * 2.83} 283` 
                            }}
                          />
                        </svg>
                        <span className="progress-text">{selectedProject.progress || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Informacije o klijentu</h4>
                    <div className="info-list compact">
                      {selectedProject.clientId && getClientById(selectedProject.clientId) && (
                        <div className="info-row">
                          <i className="bi bi-building"></i>
                          <span>{getClientById(selectedProject.clientId).companyName}</span>
                        </div>
                      )}
                      <div className="info-row">
                        <i className="bi bi-person"></i>
                        <span>{selectedProject.client}</span>
                      </div>
                      {selectedProject.phone && (
                        <div className="info-row">
                          <i className="bi bi-telephone"></i>
                          <span>{selectedProject.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Rokovi</h4>
                    <div className="info-list compact">
                      {selectedProject.startDate && (
                        <div className="info-row">
                          <i className="bi bi-calendar-plus"></i>
                          <div>
                            <span className="label">Početak</span>
                            <span>{formatDate(selectedProject.startDate)}</span>
                          </div>
                        </div>
                      )}
                      {selectedProject.deadline && (
                        <div className="info-row">
                          <i className="bi bi-calendar-check"></i>
                          <div>
                            <span className="label">Rok</span>
                            <span>{formatDate(selectedProject.deadline)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedProject.description && (
                    <div className="detail-section">
                      <h4>Opis projekta</h4>
                      <p className="description">{selectedProject.description}</p>
                    </div>
                  )}

                  {selectedProject.notes && (
                    <div className="detail-section">
                      <h4>Napomene</h4>
                      <p className="notes">{selectedProject.notes}</p>
                    </div>
                  )}

                  {/* Project Images */}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <div className="detail-section">
                      <h4>
                        <i className="bi bi-images"></i>
                        Slike projekta ({selectedProject.images.length})
                      </h4>
                      <div className="worker-images-grid">
                        {selectedProject.images.map(image => (
                          <div key={image.id} className="worker-image-item">
                            <img src={image.url} alt={image.name || 'Project image'} />
                            <a 
                              href={image.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="image-overlay-btn"
                            >
                              <i className="bi bi-zoom-in"></i>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Documents */}
                  {selectedProject.documents && selectedProject.documents.length > 0 && (
                    <div className="detail-section">
                      <h4>
                        <i className="bi bi-file-pdf"></i>
                        Dokumenti ({selectedProject.documents.length})
                      </h4>
                      <div className="worker-documents-list">
                        {selectedProject.documents.map(doc => (
                          <div key={doc.id} className="worker-document-item">
                            <div className="doc-icon">
                              <i className="bi bi-file-pdf"></i>
                            </div>
                            <div className="doc-info">
                              <span className="doc-name">{doc.name}</span>
                              <span className="doc-date">
                                {new Date(doc.uploadedAt).toLocaleDateString('sr-Latn-RS')}
                              </span>
                            </div>
                            <div className="doc-actions">
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="doc-btn view"
                                title="Otvori"
                              >
                                <i className="bi bi-eye"></i>
                              </a>
                              <a 
                                href={doc.url} 
                                download={doc.name}
                                className="doc-btn download"
                                title="Preuzmi"
                              >
                                <i className="bi bi-download"></i>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </WorkerLayout>
  )
}

export default WorkerProjects

