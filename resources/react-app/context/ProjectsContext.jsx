import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { apiCall, API } from '../config/api'

const ProjectsContext = createContext()

// API status: na_cekanju, aktivan, pauziran, zavrsen, otkazan
// React status: novi, u_toku, zavrsen, otkazan (pauziran -> u_toku)
const statusApiToReact = {
  na_cekanju: 'novi',
  aktivan: 'u_toku',
  pauziran: 'u_toku',
  zavrsen: 'zavrsen',
  otkazan: 'otkazan'
}
const statusReactToApi = {
  novi: 'na_cekanju',
  u_toku: 'aktivan',
  zavrsen: 'zavrsen',
  otkazan: 'otkazan'
}

// API prioritet: nizak, srednji, visok, hitan
// React priority: low, medium, high
const priorityApiToReact = { nizak: 'low', srednji: 'medium', visok: 'high', hitan: 'high' }
const priorityReactToApi = { low: 'nizak', medium: 'srednji', high: 'visok' }

// Map API format (projekti) → React format
function apiToProject(api) {
  if (!api) return null
  const klijent = api.klijent || {}
  const radnici = api.radnici || []
  const assignedWorkers = radnici.map(r => r.id)
  return {
    id: api.id,
    brojProjekta: api.broj_projekta,
    title: api.naziv || '',
    clientId: api.klijent_id,
    client: klijent.naziv || '',
    email: klijent.email || '',
    phone: klijent.telefon || '',
    type: 'kuhinja',
    status: statusApiToReact[api.status] || 'novi',
    priority: priorityApiToReact[api.prioritet] || 'medium',
    startDate: api.datum_pocetka ? api.datum_pocetka.split('T')[0] : '',
    deadline: api.datum_zavrsetka ? api.datum_zavrsetka.split('T')[0] : '',
    budget: api.ukupna_vrednost != null ? parseFloat(api.ukupna_vrednost) : 0,
    description: api.opis || '',
    notes: api.napomene || '',
    progress: api.procenat_zavrsenosti ?? 0,
    adresa: api.adresa_lokacije || '',
    assignedWorkers,
    faze: api.faze || [],
    images: (api.slike || []).map(s => ({ id: s.id, url: s.putanja })),
    documents: (api.dokumenti || []).map(d => ({ id: d.id, naziv: d.naziv })),
    ponudaId: api.ponuda_id,
    createdAt: api.created_at ? api.created_at.split('T')[0] : ''
  }
}

// Map React format → API format (projekti) - kao RadnikController
function projectToApi(project) {
  const today = new Date().toISOString().split('T')[0]
  const clientId = project.clientId ? parseInt(project.clientId, 10) : null
  return {
    naziv: project.title || '',
    klijent_id: clientId,
    ponuda_id: project.ponudaId || null,
    datum_pocetka: project.startDate || today,
    datum_zavrsetka: project.deadline || null,
    prioritet: priorityReactToApi[project.priority] || 'srednji',
    status: statusReactToApi[project.status] || 'na_cekanju',
    ukupna_vrednost: project.budget != null ? parseFloat(project.budget) : 0,
    opis: project.description || null,
    napomene: project.notes || null,
    adresa_lokacije: project.adresa || null,
    procenat_zavrsenosti: project.progress ?? 0
  }
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchInProgress = useRef(false)

  const fetchProjects = useCallback(async (force = false) => {
    if (fetchInProgress.current && !force) return
    if ((isInitialized || isLoading) && !force) return

    fetchInProgress.current = true
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiCall(`${API.projekti.list}?per_page=500`)
      const paginator = res.data
      const items = paginator?.data ?? (Array.isArray(res.data) ? res.data : [])
      setProjects(items.map(apiToProject))
      setIsInitialized(true)
    } catch (err) {
      console.error('Error loading projects:', err)
      setError(err?.message || 'Greška pri učitavanju')
      setProjects([])
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [])

  const location = useLocation()
  useEffect(() => {
    const isOnProjectsPage = location.pathname === '/admin/dashboard' ||
      location.pathname === '/admin/projects' ||
      location.pathname.startsWith('/worker/projects') ||
      location.pathname === '/worker/damage-report' ||
      location.pathname === '/worker/hours'
    const isAuth = localStorage.getItem('auth_token')
    if (!isOnProjectsPage || !isAuth) return
    if (isInitialized) return
    fetchProjects(true)
  }, [location.pathname, isInitialized, fetchProjects])

  const addProject = async (project) => {
    try {
      const payload = projectToApi(project)
      const res = await apiCall(API.projekti.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      if (!res?.data) {
        throw new Error('API nije vratio kreirani projekat')
      }
      const newProject = apiToProject(res.data)
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      console.error('Error adding project:', err)
      throw err
    }
  }

  const updateProject = async (id, updates) => {
    try {
      const existing = projects.find(p => p.id === id)
      if (!existing) return

      const payload = projectToApi({ ...existing, ...updates })
      const res = await apiCall(API.projekti.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToProject(res.data)
      setProjects(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  const deleteProject = async (id) => {
    try {
      await apiCall(API.projekti.delete(id), {
        method: 'DELETE'
      })
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }

  const changeProjectStatus = async (id, status) => {
    try {
      const apiStatus = statusReactToApi[status] || status
      await apiCall(API.projekti.status(id), {
        method: 'PATCH',
        body: JSON.stringify({ status: apiStatus })
      })
      const existing = projects.find(p => p.id === id)
      if (existing) {
        const updated = { ...existing, status }
        setProjects(prev => prev.map(p => p.id === id ? updated : p))
        return updated
      }
    } catch (err) {
      console.error('Error changing project status:', err)
      throw err
    }
  }

  const addRadnikToProject = async (projekatId, radnikId) => {
    try {
      await apiCall(API.projekti.addRadnik(projekatId), {
        method: 'POST',
        body: JSON.stringify({ radnik_id: radnikId })
      })
      const res = await apiCall(API.projekti.get(projekatId))
      const updated = apiToProject(res.data)
      setProjects(prev => prev.map(p => p.id === projekatId ? updated : p))
      return updated
    } catch (err) {
      console.error('Error adding worker to project:', err)
      throw err
    }
  }

  const removeRadnikFromProject = async (projekatId, radnikId) => {
    try {
      await apiCall(API.projekti.removeRadnik(projekatId, radnikId), {
        method: 'DELETE'
      })
      const res = await apiCall(API.projekti.get(projekatId))
      const updated = apiToProject(res.data)
      setProjects(prev => prev.map(p => p.id === projekatId ? updated : p))
      return updated
    } catch (err) {
      console.error('Error removing worker from project:', err)
      throw err
    }
  }

  const getProjectsByStatus = (status) => {
    if (status === 'all') return projects
    return projects.filter(p => p.status === status)
  }

  const getActiveProjects = () => {
    return projects.filter(p => p.status === 'novi' || p.status === 'u_toku')
  }

  const getProjectStats = () => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'novi' || p.status === 'u_toku').length,
      completed: projects.filter(p => p.status === 'zavrsen').length,
      cancelled: projects.filter(p => p.status === 'otkazan').length
    }
  }

  const value = {
    projects,
    isLoading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    changeProjectStatus,
    addRadnikToProject,
    removeRadnikFromProject,
    getProjectsByStatus,
    getActiveProjects,
    getProjectStats
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
