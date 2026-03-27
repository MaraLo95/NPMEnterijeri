import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { apiCall, API } from '../../config/api'
import './AdminStyles.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call real API login
      const response = await apiCall(API.auth.login, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (response.success && response.data?.access_token) {
        // Save token for API calls
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('npm_admin_auth', 'true')
        localStorage.setItem('npm_admin_email', formData.email)
        
        toast.success('Uspešno ste se prijavili!')
        navigate('/admin/dashboard')
      } else {
        toast.error(response.message || 'Pogrešni kredencijali')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Greška pri povezivanju sa serverom')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login">
      {/* Left Side - Branding */}
      <div className="login-brand">
        <div className="brand-pattern"></div>
        <div className="brand-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <motion.div 
          className="brand-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="brand-logo">
            <div className="logo-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <span>NPM <em>Enterijeri</em></span>
          </div>

          <h1>Upravljajte vašim poslovanjem</h1>
          <p>
            Pristupite admin panelu za pregled upita, upravljanje projektima 
            i ažuriranje sadržaja na vašem sajtu.
          </p>

          <div className="features">
            <div className="feature">
              <i className="bi bi-envelope-check"></i>
              <span>Upravljanje upitima</span>
            </div>
            <div className="feature">
              <i className="bi bi-images"></i>
              <span>Ažuriranje galerije</span>
            </div>
            <div className="feature">
              <i className="bi bi-bar-chart"></i>
              <span>Statistike i analitika</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-side">
        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-header">
            <h2>Dobrodošli nazad</h2>
            <p>Unesite vaše podatke za pristup</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>E-mail adresa</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  placeholder="admin@npm.rs"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lozinka</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Zapamti me
              </label>
              <a href="#" className="forgot-link">Zaboravljena lozinka?</a>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Prijavljivanje...
                </>
              ) : (
                <>
                  Prijavi se
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>ili</span>
          </div>

          <a href="/" className="back-link">
            <i className="bi bi-arrow-left"></i>
            Nazad na glavni sajt
          </a>

          <div className="login-footer">
            <p>&copy; 2025 NPM Enterijeri</p>
            <div className="security">
              <i className="bi bi-shield-check"></i>
              <span>Sigurna konekcija</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLogin


