import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkHours } from '../../context/WorkHoursContext'
import './AdminLayout.css'

function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { getPendingCount } = useWorkHours()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPonudeOpen, setIsPonudeOpen] = useState(false)
  
  const pendingCount = getPendingCount()
  
  const navItems = [
    { path: '/admin/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { path: '/admin/projects', icon: 'bi-folder', label: 'Projekti', badge: 'Novo' },
    { path: '/admin/gallery', icon: 'bi-images', label: 'Galerija' },
    { path: '/admin/workers', icon: 'bi-person-badge', label: 'Radnici' },
    { path: '/admin/clients', icon: 'bi-people', label: 'Klijenti' },
    { path: '/admin/hours', icon: 'bi-clock-history', label: 'Satnice', badge: pendingCount > 0 ? pendingCount.toString() : null, badgeType: 'warning' },
    { path: '#', icon: 'bi-envelope', label: 'Upiti', badge: '12' },
    { path: '#', icon: 'bi-gear', label: 'Podešavanja' }
  ]
  
  const ponudeItems = [
    { path: '/admin/cenovnik', icon: 'bi-currency-euro', label: 'Cenovnik' },
    { path: '/admin/obracun-ponude', icon: 'bi-calculator', label: 'Obračun ponude' },
    { path: '/admin/kreiranje-ponude', icon: 'bi-file-earmark-plus', label: 'Kreiranje ponude' }
  ]
  
  const isPonudeActive = ponudeItems.some(item => location.pathname === item.path)

  const handleLogout = () => {
    localStorage.removeItem('npm_admin_auth')
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
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
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <span>NPM <em>Admin</em></span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Glavno</span>
            {navItems.slice(0, 6).map(item => {
              if (item.path === '/admin/hours') {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                    onMouseEnter={() => import('../../pages/admin/AdminHours')}
                    end
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                    {item.badge && <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>}
                  </NavLink>
                )
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>}
                </Link>
              )
            })}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Ponude</span>
            <button
              className={`nav-item nav-dropdown-toggle ${isPonudeActive || isPonudeOpen ? 'active' : ''}`}
              onClick={() => setIsPonudeOpen(!isPonudeOpen)}
            >
              <i className="bi bi-file-earmark-text"></i>
              <span>Ponude</span>
              <i className={`bi bi-chevron-${isPonudeOpen ? 'up' : 'down'} nav-dropdown-arrow`}></i>
            </button>
            <AnimatePresence>
              {isPonudeOpen && (
                <motion.div
                  className="nav-dropdown-menu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {ponudeItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-item nav-subitem ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <i className={`bi ${item.icon}`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Sistem</span>
            {navItems.slice(6).map(item => (
              <Link
                key={item.label}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
                {item.badge && <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>}
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
                  <Link to="#" className="dropdown-item">
                    <i className="bi bi-person"></i>
                    Profil
                  </Link>
                  <Link to="#" className="dropdown-item">
                    <i className="bi bi-gear"></i>
                    Podešavanja
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
              <div className="user-avatar">AM</div>
              <div className="user-info">
                <span className="user-name">Admin NPM</span>
                <span className="user-role">Administrator</span>
              </div>
              <i className="bi bi-chevron-expand"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="header-search">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Pretraži..." />
          </div>

          <div className="header-actions">
            <button className="header-btn">
              <i className="bi bi-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <Link to="/" className="header-btn" title="Pogledaj sajt">
              <i className="bi bi-globe"></i>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content admin-panel-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout



