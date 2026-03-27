import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { apiCall, API } from '../config/api'

const ClientsContext = createContext()

// Map API format (klijenti) → React format
function apiToClient(api) {
  if (!api) return null
  // API tip: pravno_lice | fizicko_lice; React category: kompanija | fizicko_lice
  const category = api.tip === 'pravno_lice' ? 'kompanija' : api.tip || 'fizicko_lice'
  return {
    id: api.id,
    companyName: api.naziv || '',
    category,
    contactPerson: api.kontakt_osoba || '',
    phone: api.telefon || '',
    email: api.email || '',
    address: api.adresa || '',
    grad: api.grad || '',
    postanskiBroj: api.postanski_broj || '',
    pib: api.pib || '',
    maticniBroj: api.maticni_broj || '',
    notes: api.napomena || '',
    createdAt: api.created_at ? api.created_at.split('T')[0] : ''
  }
}

// Map React format → API format (klijenti)
function clientToApi(client) {
  const tip = client.category === 'kompanija' ? 'pravno_lice' : (client.category || 'fizicko_lice')
  return {
    naziv: client.companyName,
    tip,
    kontakt_osoba: client.contactPerson || null,
    telefon: client.phone || null,
    email: client.email || null,
    adresa: client.address || null,
    grad: client.grad || null,
    postanski_broj: client.postanskiBroj || null,
    pib: client.pib || null,
    maticni_broj: client.maticniBroj || null,
    napomena: client.notes || null
  }
}

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchInProgress = useRef(false)
  const fetchClients = useCallback(async (force = false) => {
    if (fetchInProgress.current && !force) return
    if ((isInitialized || isLoading) && !force) return

    fetchInProgress.current = true
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiCall(`${API.klijenti.list}?all=true`)
      const list = res.data
      const items = Array.isArray(list) ? list : (list?.data || [])
      setClients(items.map(apiToClient))
      setIsInitialized(true)
    } catch (err) {
      console.error('Error loading clients:', err)
      setError(err?.message || 'Greška pri učitavanju')
      setClients([])
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [])

  const location = useLocation()
  useEffect(() => {
    const isOnClientsPage = location.pathname === '/admin/dashboard' ||
      location.pathname === '/admin/clients' ||
      location.pathname === '/admin/projects' ||
      location.pathname === '/admin/obracun-ponude' ||
      location.pathname === '/admin/kreiranje-ponude' ||
      location.pathname.startsWith('/worker/projects')
    const isAuth = localStorage.getItem('auth_token')
    if (!isOnClientsPage || !isAuth) return
    if (isInitialized) return
    fetchClients(true)
  }, [location.pathname, isInitialized, fetchClients])

  const addClient = async (client) => {
    try {
      const payload = clientToApi(client)
      const res = await apiCall(API.klijenti.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const newClient = apiToClient(res.data)
      setClients(prev => [newClient, ...prev])
      return newClient
    } catch (err) {
      console.error('Error adding client:', err)
      throw err
    }
  }

  const updateClient = async (id, updates) => {
    try {
      const existing = clients.find(c => c.id === id)
      if (!existing) return

      const payload = clientToApi({ ...existing, ...updates })
      const res = await apiCall(API.klijenti.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToClient(res.data)
      setClients(prev => prev.map(c => c.id === id ? updated : c))
      return updated
    } catch (err) {
      console.error('Error updating client:', err)
      throw err
    }
  }

  const deleteClient = async (id) => {
    try {
      await apiCall(API.klijenti.delete(id), {
        method: 'DELETE'
      })
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting client:', err)
      throw err
    }
  }

  const getClientsByCategory = (category) => {
    if (category === 'all') return clients
    return clients.filter(c => c.category === category)
  }

  const getClientStats = () => {
    return {
      total: clients.length,
      companies: clients.filter(c => c.category === 'kompanija').length,
      individuals: clients.filter(c => c.category === 'fizicko_lice').length
    }
  }

  const searchClients = (term) => {
    const lower = term.toLowerCase()
    return clients.filter(c =>
      c.companyName.toLowerCase().includes(lower) ||
      (c.contactPerson || '').toLowerCase().includes(lower) ||
      (c.address || '').toLowerCase().includes(lower)
    )
  }

  const value = {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    getClientsByCategory,
    getClientStats,
    searchClients
  }

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider')
  }
  return context
}
