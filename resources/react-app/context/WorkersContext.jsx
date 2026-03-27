import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { apiCall, API } from '../config/api'

const WorkersContext = createContext()

// Map API format (radnici) → React format
function apiToWorker(api) {
  if (!api) return null
  return {
    id: api.id,
    firstName: api.ime || '',
    lastName: api.prezime || '',
    position: api.pozicija || '',
    startDate: api.datum_zaposlenja ? api.datum_zaposlenja.split('T')[0] : '',
    hourlyRate: api.satnica != null ? parseFloat(api.satnica) : 0,
    gender: api.pol || 'muški',
    birthDate: api.datum_rodjenja ? api.datum_rodjenja.split('T')[0] : '',
    jmbg: api.jmbg || '',
    image: api.slika || '',
    phone: api.telefon || '',
    email: api.email || '',
    address: api.adresa || '',
    active: api.status === 'aktivan',
    createdAt: api.created_at ? api.created_at.split('T')[0] : ''
  }
}

// Map React format → API format (radnici)
function workerToApi(worker) {
  return {
    ime: worker.firstName,
    prezime: worker.lastName,
    jmbg: worker.jmbg || '',
    email: worker.email || null,
    telefon: worker.phone || null,
    adresa: worker.address || null,
    datum_zaposlenja: worker.startDate || null,
    pozicija: worker.position || null,
    satnica: worker.hourlyRate != null ? parseFloat(worker.hourlyRate) : null,
    status: worker.active ? 'aktivan' : 'neaktivan'
  }
}

export function WorkersProvider({ children }) {
  const [workers, setWorkers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchInProgress = useRef(false)

  const fetchWorkers = useCallback(async (force = false) => {
    if (fetchInProgress.current && !force) return
    if ((isInitialized || isLoading) && !force) return

    fetchInProgress.current = true
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiCall(API.radnici.list)
      const list = Array.isArray(res.data) ? res.data : []
      setWorkers(list.map(apiToWorker))
      setIsInitialized(true)
    } catch (err) {
      console.error('Error loading workers:', err)
      setError(err?.message || 'Greška pri učitavanju')
      setWorkers([])
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [])

  // Add new worker
  const addWorker = async (worker) => {
    try {
      const payload = workerToApi(worker)
      const res = await apiCall(API.radnici.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const newWorker = apiToWorker(res.data)
      setWorkers(prev => [newWorker, ...prev])
      return newWorker
    } catch (err) {
      console.error('Error adding worker:', err)
      throw err
    }
  }

  // Update worker
  const updateWorker = async (id, updates) => {
    try {
      const existing = workers.find(w => w.id === id)
      if (!existing) return

      const payload = workerToApi({ ...existing, ...updates })
      const res = await apiCall(API.radnici.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToWorker(res.data)
      setWorkers(prev => prev.map(w => w.id === id ? updated : w))
      return updated
    } catch (err) {
      console.error('Error updating worker:', err)
      throw err
    }
  }

  // Delete worker
  const deleteWorker = async (id) => {
    try {
      await apiCall(API.radnici.delete(id), {
        method: 'DELETE'
      })
      setWorkers(prev => prev.filter(worker => worker.id !== id))
    } catch (err) {
      console.error('Error deleting worker:', err)
      throw err
    }
  }

  // Toggle worker active status
  const toggleWorkerStatus = async (id) => {
    try {
      const worker = workers.find(w => w.id === id)
      if (!worker) return

      const newActive = !worker.active
      const payload = workerToApi({ ...worker, active: newActive })

      const res = await apiCall(API.radnici.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToWorker(res.data)
      setWorkers(prev => prev.map(w => w.id === id ? updated : w))
      return updated
    } catch (err) {
      console.error('Error toggling worker status:', err)
      throw err
    }
  }

  // Get active workers
  const getActiveWorkers = () => {
    return workers.filter(worker => worker.active)
  }

  // Get workers by position
  const getWorkersByPosition = (position) => {
    return workers.filter(worker => worker.position === position)
  }

  // Get worker stats
  const getWorkerStats = () => {
    return {
      total: workers.length,
      active: workers.filter(w => w.active).length,
      inactive: workers.filter(w => !w.active).length
    }
  }

  // Calculate worker age
  const calculateAge = (birthDate) => {
    if (!birthDate) return '—'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Calculate employment duration
  const calculateEmploymentDuration = (startDate) => {
    if (!startDate) return '—'
    const today = new Date()
    const start = new Date(startDate)
    const years = today.getFullYear() - start.getFullYear()
    const months = today.getMonth() - start.getMonth()

    let totalMonths = years * 12 + months
    if (today.getDate() < start.getDate()) {
      totalMonths--
    }

    const resultYears = Math.floor(totalMonths / 12)
    const resultMonths = totalMonths % 12

    if (resultYears > 0) {
      return `${resultYears} god. ${resultMonths} mes.`
    }
    return `${resultMonths} mes.`
  }

  const value = {
    workers,
    isLoading,
    error,
    isInitialized,
    fetchWorkers,
    addWorker,
    updateWorker,
    deleteWorker,
    toggleWorkerStatus,
    getActiveWorkers,
    getWorkersByPosition,
    getWorkerStats,
    calculateAge,
    calculateEmploymentDuration
  }

  return (
    <WorkersContext.Provider value={value}>
      {children}
    </WorkersContext.Provider>
  )
}

export function useWorkers() {
  const context = useContext(WorkersContext)
  if (!context) {
    throw new Error('useWorkers must be used within a WorkersProvider')
  }
  return context
}
