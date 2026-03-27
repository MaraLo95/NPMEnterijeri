import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkers } from '../../context/WorkersContext'
import './WorkerLayout.css'

const navItems = [
  { path: '/worker/profile', icon: 'bi-person-circle', label: 'Moj Profil' },
  { path: '/worker/projects', icon: 'bi-folder2-open', label: 'Projekti' },
  { path: '/worker/hours', icon: 'bi-clock-history', label: 'Satnice' },
  { path: '/worker/damage-report', icon: 'bi-exclamation-triangle', label: 'Prijava oštećenja' }
]

function WorkerLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { workers } = useWorkers()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentWorker, setCurrentWorker] = useState(null)

  useEffect(() => {
    const workerId = localStorage.getItem('npm_worker_id')
    if (workerId) {
      const worker = workers.find(w => w.id === parseInt(workerId))
      if (worker) {
        setCurrentWorker(worker)
      }
    }
  }, [workers])

  const handleLogout = () => {
    localStorage.removeItem('npm_worker_auth')
    localStorage.removeItem('npm_worker_id')
    localStorage.removeItem('npm_worker_email')
    navigate('/admin/login')
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="worker-layout">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`worker-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon worker">
              <i className="bi bi-person-workspace"></i>
            </div>
            <span>NPM <em>Portal</em></span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Navigacija</span>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-dropdown">
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Link to="/worker/profile" className="dropdown-item">
                    <i className="bi bi-person"></i>
                    Moj Profil
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Odjavi se
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              className="user-card"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {currentWorker?.image ? (
                <img src={currentWorker.image} alt="" className="user-avatar-img" />
              ) : (
                <div className="user-avatar worker">
                  {currentWorker ? getInitials(currentWorker.firstName, currentWorker.lastName) : 'RD'}
                </div>
              )}
              <div className="user-info">
                <span className="user-name">
                  {currentWorker ? `${currentWorker.firstName} ${currentWorker.lastName}` : 'Radnik'}
                </span>
                <span className="user-role">{currentWorker?.position || 'Zaposleni'}</span>
              </div>
              <i className="bi bi-chevron-expand"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="worker-main">
        {/* Header */}
        <header className="worker-header">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="header-title">
            <h1>Portal za radnike</h1>
          </div>

          <div className="header-actions">
            <button className="header-btn">
              <i className="bi bi-bell"></i>
            </button>
            <Link to="/" className="header-btn" title="Pogledaj sajt">
              <i className="bi bi-globe"></i>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="worker-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default WorkerLayout

