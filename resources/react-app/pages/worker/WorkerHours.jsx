import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useProjects } from '../../context/ProjectsContext'
import { useWorkers } from '../../context/WorkersContext'
import { useWorkHours } from '../../context/WorkHoursContext'
import WorkerLayout from '../../components/worker/WorkerLayout'
import './WorkerStyles.css'

function WorkerHours() {
  const { projects } = useProjects()
  const { workers, isInitialized, isLoading, fetchWorkers } = useWorkers()
  const { 
    workHours,
    addWorkHours, 
    deleteWorkHours,
    getWorkerFirstHalfHours, 
    getWorkerSecondHalfHours,
    calculateTotalHours,
    calculateTotalPay,
    formatHours,
    submitForApproval,
    getWorkerDraftEntries
  } = useWorkHours()

  const [currentWorker, setCurrentWorker] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [firstHalfEntries, setFirstHalfEntries] = useState([])
  const [secondHalfEntries, setSecondHalfEntries] = useState([])

  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    note: ''
  })

  // Generate time options from 07:00 to 24:00
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 7; hour <= 24; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      options.push(time)
      if (hour < 24) {
        options.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // Calculate hours worked from start and end time
  const calculateWorkedHours = (start, end) => {
    if (!start || !end) return 0
    
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (endMinutes <= startMinutes) return 0
    
    return (endMinutes - startMinutes) / 60
  }

  const workedHours = calculateWorkedHours(formData.startTime, formData.endTime)

  useEffect(() => {
    if (!isInitialized && !isLoading) fetchWorkers(true)
  }, [isInitialized, isLoading, fetchWorkers])

  // Load current worker
  useEffect(() => {
    const workerId = localStorage.getItem('npm_worker_id')
    if (workerId) {
      const worker = workers.find(w => w.id === parseInt(workerId))
      if (worker) {
        setCurrentWorker(worker)
      }
    }
  }, [workers])

  // Load work hours for current month (also reloads when workHours changes)
  useEffect(() => {
    if (currentWorker) {
      const year = selectedMonth.getFullYear()
      const month = selectedMonth.getMonth()
      
      setFirstHalfEntries(getWorkerFirstHalfHours(currentWorker.id, year, month))
      setSecondHalfEntries(getWorkerSecondHalfHours(currentWorker.id, year, month))
    }
  }, [currentWorker, selectedMonth, workHours])

  // Get all active projects (not just assigned to worker)
  const activeProjects = projects.filter(p => 
    p.status === 'novi' || p.status === 'u_toku'
  )

  const [keepModalOpen, setKeepModalOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if worker is logged in
    if (!currentWorker) {
      toast.error('Morate biti prijavljeni')
      return
    }

    if (!formData.projectId) {
      toast.error('Izaberite projekat')
      return
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error('Unesite početak i završetak rada')
      return
    }

    if (workedHours <= 0) {
      toast.error('Završetak rada mora biti posle početka rada')
      return
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.date + 'T00:00:00')
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Allow entire today
    
    if (selectedDate > today) {
      toast.error('Nije moguće uneti satnice za buduće datume')
      return
    }

    // Handle special options (Radionica, Ostalo) vs regular projects
    const isSpecialOption = formData.projectId === 'radionica' || formData.projectId === 'ostalo'
    let projectName = ''
    let projectId = null
    
    if (isSpecialOption) {
      projectName = formData.projectId === 'radionica' ? 'Radionica' : 'Ostalo'
      projectId = formData.projectId
    } else {
      const project = projects.find(p => p.id === parseInt(formData.projectId))
      projectName = project?.title || ''
      projectId = parseInt(formData.projectId)
    }
    
    const totalHours = Math.floor(workedHours)
    const totalMinutes = Math.round((workedHours - totalHours) * 60)

    try {
      addWorkHours({
        workerId: currentWorker.id,
        workerName: `${currentWorker.firstName} ${currentWorker.lastName}`,
        projectId: projectId,
        projectName: projectName,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hours: totalHours,
        minutes: totalMinutes,
        note: formData.note,
        hourlyRate: currentWorker.hourlyRate || 0
      })

      toast.success('Satnica uspešno uneta!')
      
      // Keep modal open if checkbox is checked, just reset time fields
      if (keepModalOpen) {
        setFormData({
          ...formData,
          projectId: '',
          startTime: '',
          endTime: '',
          note: ''
        })
      } else {
        setIsModalOpen(false)
        setFormData({
          projectId: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          note: ''
        })
      }

      // Refresh data
      const year = selectedMonth.getFullYear()
      const month = selectedMonth.getMonth()
      setFirstHalfEntries(getWorkerFirstHalfHours(currentWorker.id, year, month))
      setSecondHalfEntries(getWorkerSecondHalfHours(currentWorker.id, year, month))
    } catch (error) {
      console.error('Error saving work hours:', error)
      toast.error('Greška pri čuvanju satnice')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj unos?')) {
      deleteWorkHours(id)
      toast.success('Unos obrisan')
      
      // Refresh data
      const year = selectedMonth.getFullYear()
      const month = selectedMonth.getMonth()
      setFirstHalfEntries(getWorkerFirstHalfHours(currentWorker.id, year, month))
      setSecondHalfEntries(getWorkerSecondHalfHours(currentWorker.id, year, month))
    }
  }

  // Submit all draft entries for approval
  const handleSubmitForApproval = () => {
    if (!currentWorker) return
    
    const draftEntries = getWorkerDraftEntries(currentWorker.id)
    if (draftEntries.length === 0) {
      toast.error('Nema satnica za slanje na odobrenje')
      return
    }
    
    const draftIds = draftEntries.map(e => e.id)
    submitForApproval(draftIds)
    toast.success(`${draftEntries.length} satnica poslato na odobrenje!`)
    
    // Refresh data
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    setFirstHalfEntries(getWorkerFirstHalfHours(currentWorker.id, year, month))
    setSecondHalfEntries(getWorkerSecondHalfHours(currentWorker.id, year, month))
  }

  // Get status badge class and text
  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending':
        return { class: 'status-pending', text: 'Na čekanju', icon: 'hourglass-split' }
      case 'approved':
        return { class: 'status-approved', text: 'Odobreno', icon: 'check-circle' }
      case 'rejected':
        return { class: 'status-rejected', text: 'Odbijeno', icon: 'x-circle' }
      default:
        return { class: 'status-draft', text: 'Nacrt', icon: 'pencil' }
    }
  }

  // Count draft entries
  const draftCount = currentWorker ? getWorkerDraftEntries(currentWorker.id).length : 0

  const changeMonth = (direction) => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + direction)
    setSelectedMonth(newDate)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short'
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

  const firstHalfTotal = calculateTotalHours(firstHalfEntries)
  const secondHalfTotal = calculateTotalHours(secondHalfEntries)
  const firstHalfPay = calculateTotalPay(firstHalfEntries, currentWorker?.hourlyRate || 0)
  const secondHalfPay = calculateTotalPay(secondHalfEntries, currentWorker?.hourlyRate || 0)

  return (
    <WorkerLayout>
      <div className="worker-page worker-hours-page">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="page-title">
            <h1>Moje satnice</h1>
            <p>Evidencija radnih sati</p>
          </div>
          <div className="page-actions">
            {draftCount > 0 && (
              <button className="btn-submit-approval" onClick={handleSubmitForApproval}>
                <i className="bi bi-send"></i>
                Pošalji na odobrenje
                <span className="draft-badge">{draftCount}</span>
              </button>
            )}
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <i className="bi bi-plus-lg"></i>
              Unesi satnice
            </button>
          </div>
        </motion.div>

        {/* Month Selector */}
        <motion.div
          className="month-selector"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button onClick={() => changeMonth(-1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="current-month">
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </span>
          <button onClick={() => changeMonth(1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="hours-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="summary-card first-half">
            <div className="summary-header">
              <i className="bi bi-calendar-week"></i>
              <span>1. - 15. {monthNames[selectedMonth.getMonth()]}</span>
            </div>
            <div className="summary-content">
              <div className="summary-hours">
                <span className="hours-value">{formatHours(firstHalfTotal)}</span>
                <span className="hours-label">Ukupno sati</span>
              </div>
              <div className="summary-pay">
                <span className="pay-value">{formatCurrency(firstHalfPay)}</span>
                <span className="pay-label">Zarada</span>
              </div>
            </div>
            <div className="summary-entries">{firstHalfEntries.length} unosa</div>
          </div>

          <div className="summary-card second-half">
            <div className="summary-header">
              <i className="bi bi-calendar-week"></i>
              <span>16. - {lastDayOfMonth}. {monthNames[selectedMonth.getMonth()]}</span>
            </div>
            <div className="summary-content">
              <div className="summary-hours">
                <span className="hours-value">{formatHours(secondHalfTotal)}</span>
                <span className="hours-label">Ukupno sati</span>
              </div>
              <div className="summary-pay">
                <span className="pay-value">{formatCurrency(secondHalfPay)}</span>
                <span className="pay-label">Zarada</span>
              </div>
            </div>
            <div className="summary-entries">{secondHalfEntries.length} unosa</div>
          </div>

          <div className="summary-card total">
            <div className="summary-header">
              <i className="bi bi-calculator"></i>
              <span>Ukupno za mesec</span>
            </div>
            <div className="summary-content">
              <div className="summary-hours">
                <span className="hours-value">{formatHours(firstHalfTotal + secondHalfTotal)}</span>
                <span className="hours-label">Ukupno sati</span>
              </div>
              <div className="summary-pay">
                <span className="pay-value">{formatCurrency(firstHalfPay + secondHalfPay)}</span>
                <span className="pay-label">Ukupna zarada</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Entries Lists */}
        <div className="hours-entries-container">
          {/* First Half Entries */}
          <motion.div
            className="entries-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>
              <i className="bi bi-clock-history"></i>
              1. - 15. {monthNames[selectedMonth.getMonth()]}
            </h3>
            {firstHalfEntries.length > 0 ? (
              <div className="entries-list">
                {firstHalfEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(entry => {
                    const statusInfo = getStatusInfo(entry.status)
                    return (
                      <div key={entry.id} className={`entry-card ${entry.status || 'draft'}`}>
                        <div className="entry-date">{formatDate(entry.date)}</div>
                        <div className="entry-content">
                          <div className="entry-project">
                            <i className="bi bi-folder2"></i>
                            {entry.projectName}
                          </div>
                          <div className="entry-hours">
                            {entry.startTime && entry.endTime ? (
                              <><i className="bi bi-clock"></i> {entry.startTime} - {entry.endTime} ({entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`})</>
                            ) : (
                              <>{entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`}</>
                            )}
                          </div>
                          {entry.note && (
                            <div className="entry-note">
                              <i className="bi bi-chat-text"></i>
                              {entry.note}
                            </div>
                          )}
                          {entry.adminNote && (
                            <div className="entry-admin-note">
                              <i className="bi bi-person-badge"></i>
                              <strong>Admin:</strong> {entry.adminNote}
                            </div>
                          )}
                        </div>
                        <div className="entry-actions">
                          <span className={`entry-status ${statusInfo.class}`}>
                            <i className={`bi bi-${statusInfo.icon}`}></i>
                            {statusInfo.text}
                          </span>
                          {(!entry.status || entry.status === 'draft') && (
                            <button 
                              className="entry-delete"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="no-entries">
                <i className="bi bi-inbox"></i>
                <p>Nema unosa za ovaj period</p>
              </div>
            )}
          </motion.div>

          {/* Second Half Entries */}
          <motion.div
            className="entries-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>
              <i className="bi bi-clock-history"></i>
              16. - {lastDayOfMonth}. {monthNames[selectedMonth.getMonth()]}
            </h3>
            {secondHalfEntries.length > 0 ? (
              <div className="entries-list">
                {secondHalfEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(entry => {
                    const statusInfo = getStatusInfo(entry.status)
                    return (
                      <div key={entry.id} className={`entry-card ${entry.status || 'draft'}`}>
                        <div className="entry-date">{formatDate(entry.date)}</div>
                        <div className="entry-content">
                          <div className="entry-project">
                            <i className="bi bi-folder2"></i>
                            {entry.projectName}
                          </div>
                          <div className="entry-hours">
                            {entry.startTime && entry.endTime ? (
                              <><i className="bi bi-clock"></i> {entry.startTime} - {entry.endTime} ({entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`})</>
                            ) : (
                              <>{entry.hours}h {entry.minutes > 0 && `${entry.minutes}min`}</>
                            )}
                          </div>
                          {entry.note && (
                            <div className="entry-note">
                              <i className="bi bi-chat-text"></i>
                              {entry.note}
                            </div>
                          )}
                          {entry.adminNote && (
                            <div className="entry-admin-note">
                              <i className="bi bi-person-badge"></i>
                              <strong>Admin:</strong> {entry.adminNote}
                            </div>
                          )}
                        </div>
                        <div className="entry-actions">
                          <span className={`entry-status ${statusInfo.class}`}>
                            <i className={`bi bi-${statusInfo.icon}`}></i>
                            {statusInfo.text}
                          </span>
                          {(!entry.status || entry.status === 'draft') && (
                            <button 
                              className="entry-delete"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="no-entries">
                <i className="bi bi-inbox"></i>
                <p>Nema unosa za ovaj period</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Add Hours Modal */}
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
                className="modal hours-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <i className="bi bi-clock"></i>
                    Unos satnice
                  </h2>
                  <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Date */}
                    <div className="form-group">
                      <label>Datum *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <small className="form-hint">Nije moguće uneti satnice za buduće datume</small>
                    </div>

                    {/* Project */}
                    <div className="form-group">
                      <label>Projekat / Aktivnost *</label>
                      <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                        required
                      >
                        <option value="">-- Izaberite projekat --</option>
                        <optgroup label="Opšte aktivnosti">
                          <option value="radionica">🔧 Radionica</option>
                          <option value="ostalo">📋 Ostalo</option>
                        </optgroup>
                        {activeProjects.length > 0 && (
                          <optgroup label="Projekti">
                            {activeProjects.map(project => (
                              <option key={project.id} value={project.id}>
                                {project.title}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    {/* Start & End Time */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Početak rada *</label>
                        <select
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          required
                        >
                          <option value="">-- Izaberite --</option>
                          {timeOptions.map(time => (
                            <option key={`start-${time}`} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Završetak rada *</label>
                        <select
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          required
                        >
                          <option value="">-- Izaberite --</option>
                          {timeOptions.filter(time => !formData.startTime || time > formData.startTime).map(time => (
                            <option key={`end-${time}`} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="form-group">
                      <label>Napomena (šta je rađeno)</label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                        placeholder="Opišite šta ste radili..."
                        rows={3}
                      ></textarea>
                    </div>

                    {/* Preview */}
                    {workedHours > 0 && currentWorker && (
                      <div className="hours-preview">
                        <div className="preview-row">
                          <span>Radno vreme:</span>
                          <strong>{formData.startTime} - {formData.endTime}</strong>
                        </div>
                        <div className="preview-row">
                          <span>Ukupno sati:</span>
                          <strong>{formatHours(workedHours)}</strong>
                        </div>
                        <div className="preview-row">
                          <span>Satnica:</span>
                          <strong>{formatCurrency(currentWorker.hourlyRate)}/h</strong>
                        </div>
                        <div className="preview-row total">
                          <span>Zarada:</span>
                          <strong>
                            {formatCurrency(workedHours * currentWorker.hourlyRate)}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <label className="keep-open-checkbox">
                      <input
                        type="checkbox"
                        checked={keepModalOpen}
                        onChange={(e) => setKeepModalOpen(e.target.checked)}
                      />
                      <span>Dodaj još satnica</span>
                    </label>
                    <div className="footer-buttons">
                      <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                        Otkaži
                      </button>
                      <button type="submit" className="btn-primary">
                        <i className="bi bi-check-lg"></i>
                        Sačuvaj
                      </button>
                    </div>
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

export default WorkerHours

