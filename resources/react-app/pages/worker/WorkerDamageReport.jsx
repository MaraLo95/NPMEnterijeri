import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useProjects } from '../../context/ProjectsContext'
import { useWorkers } from '../../context/WorkersContext'
import WorkerLayout from '../../components/worker/WorkerLayout'
import './WorkerStyles.css'

const damageTypes = [
  { id: 'materijal', label: 'Oštećen materijal', icon: 'bi-box' },
  { id: 'alat', label: 'Oštećen alat', icon: 'bi-tools' },
  { id: 'masina', label: 'Kvar mašine', icon: 'bi-gear' },
  { id: 'proizvod', label: 'Oštećen proizvod', icon: 'bi-box-seam' },
  { id: 'vozilo', label: 'Oštećenje vozila', icon: 'bi-truck' },
  { id: 'ostalo', label: 'Ostalo', icon: 'bi-question-circle' }
]

const severityLevels = [
  { id: 'low', label: 'Nisko', color: 'green', description: 'Manje oštećenje, može se popraviti' },
  { id: 'medium', label: 'Srednje', color: 'orange', description: 'Značajno oštećenje, potrebna intervencija' },
  { id: 'high', label: 'Visoko', color: 'red', description: 'Kritično oštećenje, hitna akcija' }
]

function WorkerDamageReport() {
  const { projects } = useProjects()
  const { workers, isInitialized, isLoading, fetchWorkers } = useWorkers()
  const [currentWorker, setCurrentWorker] = useState(null)
  const [assignedProjects, setAssignedProjects] = useState([])
  const [reports, setReports] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    projectId: '',
    damageType: '',
    severity: 'medium',
    title: '',
    description: '',
    location: '',
    estimatedCost: ''
  })

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

  useEffect(() => {
    if (currentWorker) {
      const myProjects = projects.filter(p => 
        p.assignedWorkers?.includes(currentWorker.id) && p.status !== 'zavrsen'
      )
      setAssignedProjects(myProjects)
    }
  }, [currentWorker, projects])

  // Load reports from localStorage
  useEffect(() => {
    const storedReports = localStorage.getItem('npm_damage_reports')
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [])

  const saveReports = (newReports) => {
    localStorage.setItem('npm_damage_reports', JSON.stringify(newReports))
    setReports(newReports)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.projectId || !formData.damageType || !formData.title || !formData.description) {
      toast.error('Molimo popunite sva obavezna polja')
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newReport = {
      id: Date.now(),
      ...formData,
      workerId: currentWorker.id,
      workerName: `${currentWorker.firstName} ${currentWorker.lastName}`,
      projectName: assignedProjects.find(p => p.id === parseInt(formData.projectId))?.title || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    saveReports([newReport, ...reports])
    
    toast.success('Prijava oštećenja je uspešno poslata!')
    setIsModalOpen(false)
    setFormData({
      projectId: '',
      damageType: '',
      severity: 'medium',
      title: '',
      description: '',
      location: '',
      estimatedCost: ''
    })
    setIsSubmitting(false)
  }

  const getMyReports = () => {
    if (!currentWorker) return []
    return reports.filter(r => r.workerId === currentWorker.id)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Na čekanju'
      case 'reviewed': return 'Pregledano'
      case 'resolved': return 'Rešeno'
      default: return status
    }
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
            <h1>Prijava oštećenja</h1>
            <p>Prijavite oštećenja materijala, alata ili opreme</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bi bi-plus-lg"></i>
            Nova prijava
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="damage-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {getMyReports().filter(r => r.status === 'pending').length}
              </span>
              <span className="stat-label">Na čekanju</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon reviewed">
              <i className="bi bi-eye"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {getMyReports().filter(r => r.status === 'reviewed').length}
              </span>
              <span className="stat-label">Pregledano</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon resolved">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {getMyReports().filter(r => r.status === 'resolved').length}
              </span>
              <span className="stat-label">Rešeno</span>
            </div>
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          className="reports-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Moje prijave</h2>
          
          {getMyReports().length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-clipboard-check"></i>
              <h3>Nema prijava</h3>
              <p>Nemate nijednu prijavu oštećenja. Kliknite na "Nova prijava" da biste kreirali novu.</p>
            </div>
          ) : (
            <div className="reports-list">
              {getMyReports().map((report, index) => (
                <motion.div
                  key={report.id}
                  className="report-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="report-icon">
                    <i className={`bi ${damageTypes.find(d => d.id === report.damageType)?.icon || 'bi-exclamation-triangle'}`}></i>
                  </div>
                  <div className="report-content">
                    <div className="report-header">
                      <h4>{report.title}</h4>
                      <span className={`severity-badge ${report.severity}`}>
                        {severityLevels.find(s => s.id === report.severity)?.label}
                      </span>
                    </div>
                    <p className="report-description">{report.description}</p>
                    <div className="report-meta">
                      <span>
                        <i className="bi bi-folder"></i>
                        {report.projectName}
                      </span>
                      <span>
                        <i className="bi bi-calendar"></i>
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className={`report-status ${report.status}`}>
                    {getStatusLabel(report.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* New Report Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="modal damage-modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <i className="bi bi-exclamation-triangle"></i>
                    Nova prijava oštećenja
                  </h2>
                  <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Project Selection */}
                    <div className="form-group">
                      <label>Projekat *</label>
                      <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                        required
                      >
                        <option value="">-- Izaberite projekat --</option>
                        {assignedProjects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Damage Type */}
                    <div className="form-group">
                      <label>Tip oštećenja *</label>
                      <div className="damage-type-grid">
                        {damageTypes.map(type => (
                          <button
                            key={type.id}
                            type="button"
                            className={`damage-type-btn ${formData.damageType === type.id ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, damageType: type.id})}
                          >
                            <i className={`bi ${type.icon}`}></i>
                            <span>{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Severity */}
                    <div className="form-group">
                      <label>Ozbiljnost *</label>
                      <div className="severity-options">
                        {severityLevels.map(level => (
                          <button
                            key={level.id}
                            type="button"
                            className={`severity-btn ${level.color} ${formData.severity === level.id ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, severity: level.id})}
                          >
                            <span className="severity-label">{level.label}</span>
                            <span className="severity-desc">{level.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                      <label>Naslov prijave *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="npr. Oštećena daska za kuhinjski element"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <label>Opis oštećenja *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detaljno opišite šta se desilo i kakvo je oštećenje..."
                        rows={4}
                        required
                      ></textarea>
                    </div>

                    {/* Location */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Lokacija</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="npr. Radionica, skladište..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Procenjena šteta (RSD)</label>
                        <input
                          type="number"
                          value={formData.estimatedCost}
                          onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Otkaži
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Slanje...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send"></i>
                          Pošalji prijavu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WorkerLayout>
  )
}

export default WorkerDamageReport

