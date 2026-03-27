import { createContext, useContext, useState, useEffect } from 'react'

const WorkHoursContext = createContext()

const STORAGE_KEY = 'npm_work_hours_data'

export function WorkHoursProvider({ children }) {
  const [workHours, setWorkHours] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load work hours data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setWorkHours(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading work hours:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workHours))
    }
  }, [workHours, isLoading])

  // Add new work hours entry (starts as draft)
  const addWorkHours = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now(),
      status: 'draft', // draft, pending, approved, rejected
      adminNote: '',
      submittedAt: null,
      reviewedAt: null,
      createdAt: new Date().toISOString()
    }
    setWorkHours(prev => [newEntry, ...prev])
    return newEntry
  }

  // Submit hours for approval (changes status from draft to pending)
  const submitForApproval = (entryIds) => {
    const submittedAt = new Date().toISOString()
    setWorkHours(prev =>
      prev.map(entry => 
        entryIds.includes(entry.id) && entry.status === 'draft'
          ? { ...entry, status: 'pending', submittedAt }
          : entry
      )
    )
  }

  // Approve hours (admin action)
  const approveHours = (entryId, adminNote = '') => {
    setWorkHours(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, status: 'approved', adminNote, reviewedAt: new Date().toISOString() }
          : entry
      )
    )
  }

  // Reject hours (admin action)
  const rejectHours = (entryId, adminNote = '') => {
    setWorkHours(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, status: 'rejected', adminNote, reviewedAt: new Date().toISOString() }
          : entry
      )
    )
  }

  // Get pending approvals count
  const getPendingCount = () => {
    return workHours.filter(entry => entry.status === 'pending').length
  }

  // Get all pending entries
  const getPendingEntries = () => {
    return workHours.filter(entry => entry.status === 'pending')
  }

  // Get draft entries for a worker on a specific date
  const getDraftEntriesByDate = (workerId, date) => {
    return workHours.filter(entry => 
      entry.workerId === workerId && 
      entry.date === date && 
      entry.status === 'draft'
    )
  }

  // Get all draft entries for a worker
  const getWorkerDraftEntries = (workerId) => {
    return workHours.filter(entry => 
      entry.workerId === workerId && 
      entry.status === 'draft'
    )
  }

  // Update work hours entry
  const updateWorkHours = (id, updates) => {
    setWorkHours(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
    )
  }

  // Delete work hours entry
  const deleteWorkHours = (id) => {
    setWorkHours(prev => prev.filter(entry => entry.id !== id))
  }

  // Get work hours for a specific worker
  const getWorkerHours = (workerId) => {
    return workHours.filter(entry => entry.workerId === workerId)
  }

  // Get work hours for current month
  const getMonthlyHours = (workerId, year, month) => {
    return workHours.filter(entry => {
      const entryDate = new Date(entry.date)
      return (
        entry.workerId === workerId &&
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month
      )
    })
  }

  // Get work hours for first half of month (1-15) - approved only for admin, all for worker
  const getFirstHalfHours = (workerId, year, month, includeAll = false) => {
    return workHours.filter(entry => {
      const entryDate = new Date(entry.date)
      const day = entryDate.getDate()
      const statusOk = includeAll || entry.status === 'approved' || !entry.status
      return (
        entry.workerId === workerId &&
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month &&
        day >= 1 && day <= 15 &&
        statusOk
      )
    })
  }

  // Get work hours for second half of month (16-end) - approved only for admin, all for worker
  const getSecondHalfHours = (workerId, year, month, includeAll = false) => {
    return workHours.filter(entry => {
      const entryDate = new Date(entry.date)
      const day = entryDate.getDate()
      const statusOk = includeAll || entry.status === 'approved' || !entry.status
      return (
        entry.workerId === workerId &&
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month &&
        day >= 16 &&
        statusOk
      )
    })
  }

  // Get worker's own hours (includes all statuses)
  const getWorkerFirstHalfHours = (workerId, year, month) => {
    return workHours.filter(entry => {
      const entryDate = new Date(entry.date)
      const day = entryDate.getDate()
      return (
        entry.workerId === workerId &&
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month &&
        day >= 1 && day <= 15
      )
    })
  }

  const getWorkerSecondHalfHours = (workerId, year, month) => {
    return workHours.filter(entry => {
      const entryDate = new Date(entry.date)
      const day = entryDate.getDate()
      return (
        entry.workerId === workerId &&
        entryDate.getFullYear() === year &&
        entryDate.getMonth() === month &&
        day >= 16
      )
    })
  }

  // Calculate total hours from entries
  const calculateTotalHours = (entries) => {
    return entries.reduce((total, entry) => {
      const hours = entry.hours || 0
      const minutes = (entry.minutes || 0) / 60
      return total + hours + minutes
    }, 0)
  }

  // Calculate total pay from entries
  const calculateTotalPay = (entries, hourlyRate) => {
    const totalHours = calculateTotalHours(entries)
    return totalHours * hourlyRate
  }

  // Get all workers' hours summary for a month
  const getAllWorkersSummary = (year, month) => {
    const workerIds = [...new Set(workHours.map(e => e.workerId))]
    
    return workerIds.map(workerId => {
      const firstHalf = getFirstHalfHours(workerId, year, month)
      const secondHalf = getSecondHalfHours(workerId, year, month)
      
      return {
        workerId,
        firstHalfHours: calculateTotalHours(firstHalf),
        secondHalfHours: calculateTotalHours(secondHalf),
        firstHalfEntries: firstHalf,
        secondHalfEntries: secondHalf,
        totalHours: calculateTotalHours([...firstHalf, ...secondHalf])
      }
    })
  }

  // Format hours for display (e.g., 8.5 -> "8h 30min")
  const formatHours = (totalHours) => {
    const hours = Math.floor(totalHours)
    const minutes = Math.round((totalHours - hours) * 60)
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}min`
  }

  const value = {
    workHours,
    isLoading,
    addWorkHours,
    updateWorkHours,
    deleteWorkHours,
    getWorkerHours,
    getMonthlyHours,
    getFirstHalfHours,
    getSecondHalfHours,
    getWorkerFirstHalfHours,
    getWorkerSecondHalfHours,
    calculateTotalHours,
    calculateTotalPay,
    getAllWorkersSummary,
    formatHours,
    // Approval workflow
    submitForApproval,
    approveHours,
    rejectHours,
    getPendingCount,
    getPendingEntries,
    getDraftEntriesByDate,
    getWorkerDraftEntries
  }

  return (
    <WorkHoursContext.Provider value={value}>
      {children}
    </WorkHoursContext.Provider>
  )
}

export function useWorkHours() {
  const context = useContext(WorkHoursContext)
  if (!context) {
    throw new Error('useWorkHours must be used within a WorkHoursProvider')
  }
  return context
}
