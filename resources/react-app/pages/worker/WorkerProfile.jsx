import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWorkers } from '../../context/WorkersContext'
import WorkerLayout from '../../components/worker/WorkerLayout'
import './WorkerStyles.css'

function WorkerProfile() {
  const { workers, isInitialized, isLoading, fetchWorkers, calculateAge, calculateEmploymentDuration } = useWorkers()
  const [currentWorker, setCurrentWorker] = useState(null)

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

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sr-RS').format(amount) + ' RSD'
  }

  if (!currentWorker) {
    return (
      <WorkerLayout>
        <div className="worker-page">
          <div className="loading-state">
            <i className="bi bi-person-circle"></i>
            <p>Učitavanje profila...</p>
          </div>
        </div>
      </WorkerLayout>
    )
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
            <h1>Moj Profil</h1>
            <p>Pregledajte vaše lične i poslovne podatke</p>
          </div>
        </motion.div>

        <div className="profile-layout">
          {/* Profile Card */}
          <motion.div
            className="profile-card main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="profile-header">
              <div className="profile-avatar">
                {currentWorker.image ? (
                  <img src={currentWorker.image} alt={`${currentWorker.firstName} ${currentWorker.lastName}`} />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="bi bi-person"></i>
                  </div>
                )}
                <span className={`status-badge ${currentWorker.status === 'active' || currentWorker.active ? 'active' : 'inactive'}`}>
                  {currentWorker.status === 'active' || currentWorker.active ? 'Aktivan' : 'Neaktivan'}
                </span>
              </div>
              <div className="profile-name">
                <h2>{currentWorker.firstName} {currentWorker.lastName}</h2>
                <span className="position">{currentWorker.position}</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{calculateAge(currentWorker.dateOfBirth || currentWorker.birthDate)}</span>
                <span className="stat-label">Godina</span>
              </div>
              <div className="stat">
                <span className="stat-value">{calculateEmploymentDuration(currentWorker.startDate)}</span>
                <span className="stat-label">Staž (meseci)</span>
              </div>
              <div className="stat">
                <span className="stat-value">{formatCurrency(currentWorker.hourlyRate)}</span>
                <span className="stat-label">Po satu</span>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-header">
              <i className="bi bi-person-vcard"></i>
              <h3>Lični podaci</h3>
            </div>
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Ime i prezime</span>
                <span className="info-value">{currentWorker.firstName} {currentWorker.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Datum rođenja</span>
                <span className="info-value">{formatDate(currentWorker.dateOfBirth || currentWorker.birthDate)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Pol</span>
                <span className="info-value">
                  {currentWorker.gender === 'M' || currentWorker.gender === 'muški' ? 'Muški' : 'Ženski'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">JMBG</span>
                <span className="info-value masked">{currentWorker.jmbg?.substring(0, 7)}*****</span>
              </div>
              {currentWorker.address && (
                <div className="info-row">
                  <span className="info-label">Adresa</span>
                  <span className="info-value">{currentWorker.address}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <i className="bi bi-telephone"></i>
              <h3>Kontakt podaci</h3>
            </div>
            <div className="info-list">
              {currentWorker.phone && (
                <div className="info-row">
                  <span className="info-label">Telefon</span>
                  <span className="info-value">
                    <a href={`tel:${currentWorker.phone}`}>{currentWorker.phone}</a>
                  </span>
                </div>
              )}
              {currentWorker.email && (
                <div className="info-row">
                  <span className="info-label">E-mail</span>
                  <span className="info-value">
                    <a href={`mailto:${currentWorker.email}`}>{currentWorker.email}</a>
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Employment Info */}
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header">
              <i className="bi bi-briefcase"></i>
              <h3>Podaci o zaposlenju</h3>
            </div>
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Pozicija</span>
                <span className="info-value">{currentWorker.position}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Datum zaposlenja</span>
                <span className="info-value">{formatDate(currentWorker.startDate)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Satnica</span>
                <span className="info-value highlight">{formatCurrency(currentWorker.hourlyRate)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className={`info-value status-tag ${currentWorker.status === 'active' || currentWorker.active ? 'active' : 'inactive'}`}>
                  {currentWorker.status === 'active' || currentWorker.active ? 'Aktivan' : 'Neaktivan'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {currentWorker.notes && (
            <motion.div
              className="profile-card full-width"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="card-header">
                <i className="bi bi-sticky"></i>
                <h3>Napomene</h3>
              </div>
              <p className="notes-text">{currentWorker.notes}</p>
            </motion.div>
          )}
        </div>
      </div>
    </WorkerLayout>
  )
}

export default WorkerProfile

