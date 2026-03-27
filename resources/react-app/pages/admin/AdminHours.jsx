import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useWorkers } from '../../context/WorkersContext'
import { useWorkHours } from '../../context/WorkHoursContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminStyles.css'

function AdminHours() {
  const navigate = useNavigate()
  const { workers, isInitialized: workersInit, isLoading: workersLoading, fetchWorkers, getActiveWorkers } = useWorkers()
  const { 
    workHours,
    getFirstHalfHours, 
    getSecondHalfHours,
    calculateTotalHours,
    calculateTotalPay,
    formatHours,
    getPendingEntries,
    getPendingCount,
    approveHours,
    rejectHours
  } = useWorkHours()

  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [workersSummary, setWorkersSummary] = useState([])
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [pendingEntries, setPendingEntries] = useState([])
  const [adminNotes, setAdminNotes] = useState({})

  const activeWorkers = getActiveWorkers()
  const pendingCount = getPendingCount()

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) {
      navigate('/admin/login')
      return
    }
    if (!workersInit && !workersLoading) fetchWorkers(true)
  }, [navigate, workersInit, workersLoading, fetchWorkers])

  // Calculate summary for all workers
  useEffect(() => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()

    const summary = activeWorkers.map(worker => {
      const firstHalf = getFirstHalfHours(worker.id, year, month)
      const secondHalf = getSecondHalfHours(worker.id, year, month)
      const firstHalfTotal = calculateTotalHours(firstHalf)
      const secondHalfTotal = calculateTotalHours(secondHalf)

      return {
        worker,
        firstHalfHours: firstHalfTotal,
        secondHalfHours: secondHalfTotal,
        totalHours: firstHalfTotal + secondHalfTotal,
        firstHalfPay: calculateTotalPay(firstHalf, worker.hourlyRate),
        secondHalfPay: calculateTotalPay(secondHalf, worker.hourlyRate),
        totalPay: calculateTotalPay([...firstHalf, ...secondHalf], worker.hourlyRate),
        firstHalfEntries: firstHalf,
        secondHalfEntries: secondHalf
      }
    })

    setWorkersSummary(summary)
    
    // Update selectedWorker if it exists
    if (selectedWorker) {
      const updatedWorker = summary.find(s => s.worker.id === selectedWorker.worker.id)
      if (updatedWorker) {
        setSelectedWorker(updatedWorker)
      }
    }
  }, [activeWorkers, selectedMonth, workHours])

  // Load pending entries
  useEffect(() => {
    setPendingEntries(getPendingEntries())
  }, [workHours])

  const changeMonth = (direction) => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + direction)
    setSelectedMonth(newDate)
  }

  // Handle approve
  const handleApprove = (entryId) => {
    const note = adminNotes[entryId] || ''
    approveHours(entryId, note)
    
    // Immediately update local state
    setPendingEntries(prev => prev.filter(entry => entry.id !== entryId))
    
    setAdminNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[entryId]
      return newNotes
    })
    toast.success('Satnica odobrena!')
  }

  // Handle reject
  const handleReject = (entryId) => {
    const note = adminNotes[entryId] || ''
    if (!note.trim()) {
      toast.error('Molimo unesite razlog odbijanja')
      return
    }
    rejectHours(entryId, note)
    
    // Immediately update local state
    setPendingEntries(prev => prev.filter(entry => entry.id !== entryId))
    setAdminNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[entryId]
      return newNotes
    })
    toast.success('Satnica odbijena')
  }

  // Update note for entry
  const updateNote = (entryId, note) => {
    setAdminNotes(prev => ({ ...prev, [entryId]: note }))
  }

  // Group pending entries by worker
  const pendingByWorker = pendingEntries.reduce((acc, entry) => {
    const workerId = entry.workerId
    if (!acc[workerId]) {
      acc[workerId] = {
        workerName: entry.workerName,
        entries: []
      }
    }
    acc[workerId].entries.push(entry)
    return acc
  }, {})

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sr-RS').format(Math.round(amount)) + ' RSD'
  }

  const monthNames = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ]

  // Get the last day of the selected month
  const getLastDayOfMonth = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const lastDayOfMonth = getLastDayOfMonth()

  // Calculate totals
  const totalFirstHalf = workersSummary.reduce((sum, w) => sum + w.firstHalfHours, 0)
  const totalSecondHalf = workersSummary.reduce((sum, w) => sum + w.secondHalfHours, 0)
  const totalPayFirstHalf = workersSummary.reduce((sum, w) => sum + w.firstHalfPay, 0)
  const totalPaySecondHalf = workersSummary.reduce((sum, w) => sum + w.secondHalfPay, 0)

  return (
    <AdminLayout>
      <div className="admin-hours">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Evidencija satnica</h1>
            <p>Pregled radnih sati zaposlenih</p>
          </div>
          {pendingCount > 0 && (
            <button 
              className="btn-pending-approvals"
              onClick={() => setShowPendingModal(true)}
            >
              <i className="bi bi-clock-history"></i>
              Na čekanju
              <span className="pending-count-badge">{pendingCount}</span>
            </button>
          )}
        </div>

        {/* Month Selector */}
        <motion.div
          className="month-selector-admin"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="month-nav-btn" onClick={() => changeMonth(-1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <div className="current-month-display">
            <i className="bi bi-calendar3"></i>
            <span>{monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}</span>
          </div>
          <button className="month-nav-btn" onClick={() => changeMonth(1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="hours-stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card hours-stat">
            <div className="stat-icon first-half">
              <i className="bi bi-calendar-week"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">1. - 15. {monthNames[selectedMonth.getMonth()]}</span>
              <span className="stat-value">{formatHours(totalFirstHalf)}</span>
              <span className="stat-secondary">{formatCurrency(totalPayFirstHalf)}</span>
            </div>
          </div>

          <div className="stat-card hours-stat">
            <div className="stat-icon second-half">
              <i className="bi bi-calendar-week"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">16. - {lastDayOfMonth}. {monthNames[selectedMonth.getMonth()]}</span>
              <span className="stat-value">{formatHours(totalSecondHalf)}</span>
              <span className="stat-secondary">{formatCurrency(totalPaySecondHalf)}</span>
            </div>
          </div>

          <div className="stat-card hours-stat total">
            <div className="stat-icon total">
              <i className="bi bi-calculator"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Ukupno za mesec</span>
              <span className="stat-value">{formatHours(totalFirstHalf + totalSecondHalf)}</span>
              <span className="stat-secondary">{formatCurrency(totalPayFirstHalf + totalPaySecondHalf)}</span>
            </div>
          </div>
        </motion.div>

        {/* Workers Table & Details */}
        <div className="hours-content-grid">
          {/* Workers Table */}
          <motion.div
            className="workers-hours-table"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="table-header">
              <h3><i className="bi bi-people"></i> Radnici</h3>
            </div>

            {workersSummary.length > 0 ? (
              <div className="table-content">
                <div className="table-row header-row">
                  <div className="col-worker">Radnik</div>
                  <div className="col-hours">1.-15.</div>
                  <div className="col-hours">16.-{lastDayOfMonth}.</div>
                  <div className="col-total">Ukupno</div>
                </div>

                {workersSummary.map((item, index) => (
                  <motion.div
                    key={item.worker.id}
                    className={`table-row ${selectedWorker?.id === item.worker.id ? 'selected' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => setSelectedWorker(selectedWorker?.id === item.worker.id ? null : item)}
                  >
                    <div className="col-worker">
                      <div className="worker-avatar-small">
                        {item.worker.image ? (
                          <img src={item.worker.image} alt="" />
                        ) : (
                          <span>
                            {item.worker.firstName.charAt(0)}{item.worker.lastName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="worker-info-small">
                        <span className="worker-name">{item.worker.firstName} {item.worker.lastName}</span>
                        <span className="worker-position">{item.worker.position}</span>
                      </div>
                    </div>
                    <div className="col-hours">
                      <span className="hours-value">{formatHours(item.firstHalfHours)}</span>
                      <span className="pay-value">{formatCurrency(item.firstHalfPay)}</span>
                    </div>
                    <div className="col-hours">
                      <span className="hours-value">{formatHours(item.secondHalfHours)}</span>
                      <span className="pay-value">{formatCurrency(item.secondHalfPay)}</span>
                    </div>
                    <div className="col-total">
                      <span className="hours-value">{formatHours(item.totalHours)}</span>
                      <span className="pay-value highlight">{formatCurrency(item.totalPay)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <i className="bi bi-clock-history"></i>
                <p>Nema radnika sa unetim satnicama</p>
              </div>
            )}
          </motion.div>

          {/* Worker Details Panel */}
          <AnimatePresence>
            {selectedWorker && (
              <motion.div
                className="worker-hours-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="detail-header">
                  <div className="worker-info-large">
                    <div className="worker-avatar-large">
                      {selectedWorker.worker.image ? (
                        <img src={selectedWorker.worker.image} alt="" />
                      ) : (
                        <span>
                          {selectedWorker.worker.firstName.charAt(0)}
                          {selectedWorker.worker.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3>{selectedWorker.worker.firstName} {selectedWorker.worker.lastName}</h3>
                      <span className="position">{selectedWorker.worker.position}</span>
                      <span className="rate">Satnica: {formatCurrency(selectedWorker.worker.hourlyRate)}/h</span>
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedWorker(null)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="detail-content">
                  {/* First Half Entries */}
                  <div className="entries-section">
                    <div className="section-title">
                      <span>1. - 15. {monthNames[selectedMonth.getMonth()]}</span>
                      <span className="section-total">{formatHours(selectedWorker.firstHalfHours)}</span>
                    </div>

                    {selectedWorker.firstHalfEntries.length > 0 ? (
                      <div className="entries-list">
                        {selectedWorker.firstHalfEntries
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map(entry => (
                            <div key={entry.id} className="entry-item">
                              <div className="entry-date-badge">
                                {new Date(entry.date).getDate()}
                              </div>
                              <div className="entry-details">
                                <div className="entry-project-name">
                                  <i className="bi bi-folder2"></i>
                                  {entry.projectName}
                                </div>
                                <div className="entry-time">
                                  <i className="bi bi-clock"></i>
                                  {entry.startTime && entry.endTime ? (
                                    <>{entry.startTime} - {entry.endTime} ({entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`})</>
                                  ) : (
                                    <>{entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`}</>
                                  )}
                                </div>
                                {entry.note && (
                                  <div className="entry-comment">
                                    <i className="bi bi-chat-left-text"></i>
                                    {entry.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="no-entries-small">Nema unosa</div>
                    )}
                  </div>

                  {/* Second Half Entries */}
                  <div className="entries-section">
                    <div className="section-title">
                      <span>16. - {lastDayOfMonth}. {monthNames[selectedMonth.getMonth()]}</span>
                      <span className="section-total">{formatHours(selectedWorker.secondHalfHours)}</span>
                    </div>

                    {selectedWorker.secondHalfEntries.length > 0 ? (
                      <div className="entries-list">
                        {selectedWorker.secondHalfEntries
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map(entry => (
                            <div key={entry.id} className="entry-item">
                              <div className="entry-date-badge">
                                {new Date(entry.date).getDate()}
                              </div>
                              <div className="entry-details">
                                <div className="entry-project-name">
                                  <i className="bi bi-folder2"></i>
                                  {entry.projectName}
                                </div>
                                <div className="entry-time">
                                  <i className="bi bi-clock"></i>
                                  {entry.startTime && entry.endTime ? (
                                    <>{entry.startTime} - {entry.endTime} ({entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`})</>
                                  ) : (
                                    <>{entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`}</>
                                  )}
                                </div>
                                {entry.note && (
                                  <div className="entry-comment">
                                    <i className="bi bi-chat-left-text"></i>
                                    {entry.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="no-entries-small">Nema unosa</div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="detail-summary">
                    <div className="summary-row">
                      <span>Ukupno sati:</span>
                      <strong>{formatHours(selectedWorker.totalHours)}</strong>
                    </div>
                    <div className="summary-row highlight">
                      <span>Ukupna zarada:</span>
                      <strong>{formatCurrency(selectedWorker.totalPay)}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pending Approvals Modal */}
        <AnimatePresence>
          {showPendingModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPendingModal(false)}
            >
              <motion.div
                className="modal pending-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <i className="bi bi-clock-history"></i>
                    Satnice na čekanju
                    <span className="header-badge">{pendingCount}</span>
                  </h2>
                  <button className="close-btn" onClick={() => setShowPendingModal(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="modal-body pending-body">
                  {Object.keys(pendingByWorker).length > 0 ? (
                    Object.entries(pendingByWorker).map(([workerId, data]) => (
                      <div key={workerId} className="pending-worker-section">
                        <div className="pending-worker-header">
                          <i className="bi bi-person-circle"></i>
                          <span>{data.workerName}</span>
                          <span className="entries-count">{data.entries.length} {data.entries.length === 1 ? 'satnica' : 'satnica'}</span>
                        </div>
                        
                        <div className="pending-entries-list">
                          {data.entries
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(entry => (
                              <div key={entry.id} className="pending-entry-card">
                                <div className="pending-entry-info">
                                  <div className="pending-entry-date">
                                    {new Date(entry.date).toLocaleDateString('sr-Latn-RS', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </div>
                                  <div className="pending-entry-project">
                                    <i className="bi bi-folder2"></i>
                                    {entry.projectName}
                                  </div>
                                  <div className="pending-entry-time">
                                    <i className="bi bi-clock"></i>
                                    {entry.startTime} - {entry.endTime} 
                                    <strong>({entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`})</strong>
                                  </div>
                                  {entry.note && (
                                    <div className="pending-entry-note">
                                      <i className="bi bi-chat-text"></i>
                                      {entry.note}
                                    </div>
                                  )}
                                </div>

                                <div className="pending-entry-actions">
                                  <textarea
                                    placeholder="Napomena za radnika (obavezno za odbijanje)..."
                                    value={adminNotes[entry.id] || ''}
                                    onChange={(e) => updateNote(entry.id, e.target.value)}
                                    rows={2}
                                  ></textarea>
                                  <div className="action-buttons">
                                    <button 
                                      className="btn-approve"
                                      onClick={() => handleApprove(entry.id)}
                                    >
                                      <i className="bi bi-check-lg"></i>
                                      Odobri
                                    </button>
                                    <button 
                                      className="btn-reject"
                                      onClick={() => handleReject(entry.id)}
                                    >
                                      <i className="bi bi-x-lg"></i>
                                      Odbij
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-pending">
                      <i className="bi bi-check-circle"></i>
                      <p>Nema satnica na čekanju</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminHours

