import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useGallery } from '../../context/GalleryContext'
import { useProjects } from '../../context/ProjectsContext'
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

const statusLabels = {
  novi: { label: 'Novi', color: 'blue' },
  u_toku: { label: 'U toku', color: 'orange' },
  zavrsen: { label: 'Završen', color: 'green' },
  otkazan: { label: 'Otkazan', color: 'red' }
}

const priorityLabels = {
  high: { label: 'Visok', color: 'red' },
  medium: { label: 'Srednji', color: 'orange' },
  low: { label: 'Nizak', color: 'green' }
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { galleryItems } = useGallery()
  const { projects, getActiveProjects, getProjectStats, addProject } = useProjects()
  const { clients } = useClients()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
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
    notes: ''
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) {
      navigate('/admin/login')
    }
  }, [navigate])

  const activeProjects = getActiveProjects()
  const projectStats = getProjectStats()

  const stats = [
    {
      icon: 'bi-people',
      value: clients.length,
      label: 'Ukupno klijenata',
      color: 'blue'
    },
    {
      icon: 'bi-folder',
      value: projectStats.total,
      label: 'Ukupno projekata',
      color: 'gold'
    },
    {
      icon: 'bi-folder-check',
      value: projectStats.active,
      label: 'Aktivnih projekata',
      color: 'green'
    },
    {
      icon: 'bi-check-circle',
      value: projectStats.completed,
      label: 'Završenih projekata',
      color: 'purple'
    }
  ]

  const quickActions = [
    {
      icon: 'bi-plus-lg',
      title: 'Novi projekat',
      desc: 'Kreirajte novi projekat',
      action: () => setIsProjectModalOpen(true),
      color: 'blue'
    },
    {
      icon: 'bi-image',
      title: 'Dodaj fotografiju',
      desc: 'Dodajte nove slike u galeriju',
      link: '/admin/gallery',
      color: 'gold'
    },
    {
      icon: 'bi-folder',
      title: 'Svi projekti',
      desc: 'Pregledajte sve projekte',
      link: '/admin/projects',
      color: 'green'
    }
  ]

  const recentActivity = []

  const handleCreateProject = (e) => {
    e.preventDefault()
    
    if (!newProject.title || !newProject.client) {
      toast.error('Molimo unesite naziv projekta i ime klijenta')
      return
    }

    addProject(newProject)
    toast.success('Projekat je uspešno kreiran!')
    setIsProjectModalOpen(false)
    setNewProject({
      title: '',
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
      notes: ''
    })
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Dobrodošli nazad, Admin</p>
          </div>
          <button className="btn-add" onClick={() => setIsProjectModalOpen(true)}>
            <i className="bi bi-plus-lg"></i>
            Novi projekat
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              {action.link ? (
                <Link to={action.link} className={`action-card ${action.color}`}>
                  <div className="action-icon">
                    <i className={`bi ${action.icon}`}></i>
                  </div>
                  <div className="action-text">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              ) : (
                <button onClick={action.action} className={`action-card ${action.color}`}>
                  <div className="action-icon">
                    <i className={`bi ${action.icon}`}></i>
                  </div>
                  <div className="action-text">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Projects Section */}
        <motion.div 
          className="card projects-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="card-header">
            <h2>
              <i className="bi bi-folder" style={{ marginRight: '10px', color: 'var(--npm-gold)' }}></i>
              Aktivni projekti
            </h2>
            <div className="card-header-actions">
              <button className="btn-create-project" onClick={() => setIsProjectModalOpen(true)}>
                <i className="bi bi-plus-lg"></i>
                Kreiraj projekat
              </button>
              <Link to="/admin/projects" className="card-link">
                Vidi sve <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          {activeProjects.length > 0 ? (
            <div className="projects-grid">
              {activeProjects.slice(0, 4).map((project, index) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <div className="project-header">
                    <span className={`project-status ${statusLabels[project.status].color}`}>
                      {statusLabels[project.status].label}
                    </span>
                    <span className={`project-priority ${priorityLabels[project.priority].color}`}>
                      {priorityLabels[project.priority].label}
                    </span>
                  </div>
                  <h4 className="project-title">{project.title}</h4>
                  <div className="project-meta">
                    <span><i className="bi bi-person"></i> {project.client}</span>
                    <span><i className="bi bi-tag"></i> {projectTypes[project.type]}</span>
                  </div>
                  <div className="project-progress">
                    <div className="progress-header">
                      <span>Napredak</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="project-footer">
                    <span className="project-deadline">
                      <i className="bi bi-calendar"></i>
                      {project.deadline}
                    </span>
                    <Link to="/admin/projects" className="project-view-btn">
                      Detalji <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="projects-empty">
              <i className="bi bi-folder-x"></i>
              <h3>Nema aktivnih projekata</h3>
              <p>Kreirajte prvi projekat klikom na dugme iznad</p>
            </div>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Gallery */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <div className="card-header">
              <h2>Poslednje fotografije</h2>
              <Link to="/admin/gallery" className="card-link">
                Vidi sve <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="gallery-preview">
              {galleryItems.slice(0, 6).map(item => (
                <div key={item.id} className="gallery-preview-item">
                  <img src={item.image} alt={item.title} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <div className="card-header">
              <h2>Nedavne aktivnosti</h2>
              <button className="card-link">
                Vidi sve <i className="bi bi-arrow-right"></i>
              </button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    <i className={`bi ${activity.icon}`}></i>
                  </div>
                  <div className="activity-content">
                    <p>{activity.text}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid - na dnu */}
        <div className="stats-grid stats-grid-bottom">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`stat-card ${stat.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
            >
              <div className="stat-header">
                <div className="stat-icon">
                  <i className={`bi ${stat.icon}`}></i>
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProjectModalOpen(false)}
          >
            <motion.div
              className="modal modal-large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2><i className="bi bi-folder-plus"></i> Novi projekat</h2>
                <button className="modal-close" onClick={() => setIsProjectModalOpen(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleCreateProject}>
                <div className="modal-body">
                  <div className="form-section">
                    <h3>Osnovne informacije</h3>
                    <div className="form-group">
                      <label>Naziv projekta *</label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="npr. Kuhinja po meri - Porodica Petrović"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tip projekta</label>
                        <select
                          value={newProject.type}
                          onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                        >
                          {Object.entries(projectTypes).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prioritet</label>
                        <select
                          value={newProject.priority}
                          onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                        >
                          <option value="low">Nizak</option>
                          <option value="medium">Srednji</option>
                          <option value="high">Visok</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Podaci o klijentu</h3>
                    <div className="form-group">
                      <label>Ime klijenta *</label>
                      <input
                        type="text"
                        value={newProject.client}
                        onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                        placeholder="Ime i prezime ili naziv firme"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>E-mail</label>
                        <input
                          type="email"
                          value={newProject.email}
                          onChange={(e) => setNewProject({...newProject, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefon</label>
                        <input
                          type="tel"
                          value={newProject.phone}
                          onChange={(e) => setNewProject({...newProject, phone: e.target.value})}
                          placeholder="+381 6X XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Rokovi i budžet</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Datum početka</label>
                        <input
                          type="date"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Rok završetka</label>
                        <input
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Budžet (RSD)</label>
                      <input
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Detalji</h3>
                    <div className="form-group">
                      <label>Opis projekta</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Opišite zahteve klijenta..."
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Napomene</label>
                      <textarea
                        value={newProject.notes}
                        onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                        placeholder="Dodatne napomene..."
                        rows="2"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsProjectModalOpen(false)}>
                    Otkaži
                  </button>
                  <button type="submit" className="btn-save">
                    <i className="bi bi-check-lg"></i>
                    Kreiraj projekat
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

export default AdminDashboard
