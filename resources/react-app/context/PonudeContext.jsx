import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { apiCall, API } from '../config/api'

const PonudeContext = createContext()

// Map API format (ponude) → React format
function apiToPonuda(api) {
  if (!api) return null
  const klijent = api.klijent || {}
  return {
    id: api.id,
    broj_ponude: api.broj_ponude || '',
    klijent_id: api.klijent_id,
    client_name: klijent.naziv || '',
    naziv_ponude: api.naziv_ponude || '',
    naziv_projekta: api.naziv_projekta || '',
    datum_ponude: api.datum_ponude ? api.datum_ponude.split('T')[0] : '',
    datum_vazenja: api.datum_vazenja ? api.datum_vazenja.split('T')[0] : '',
    rok_isporuke: api.rok_isporuke || '',
    nacin_placanja: api.nacin_placanja || '',
    napomena: api.napomena || '',
    napomena_pdv: api.napomena_pdv || '',
    status: api.status || 'nacrt',
    ukupna_cena: api.ukupna_cena != null ? parseFloat(api.ukupna_cena) : 0,
    stavke: api.stavke || [],
    godina: api.datum_ponude ? new Date(api.datum_ponude).getFullYear() : new Date().getFullYear(),
    obracun_id: api.obracun_id,
    obracun: api.obracun,
    isNovo: api.is_novo ?? false
  }
}

// Map React format → API format (ponude)
function ponudaToApi(ponuda) {
  return {
    klijent_id: ponuda.klijent_id,
    naziv_ponude: ponuda.naziv_ponude || ponuda.naziv_projekta,
    naziv_projekta: ponuda.naziv_projekta || null,
    datum_ponude: ponuda.datum_ponude || null,
    datum_vazenja: ponuda.datum_vazenja || null,
    rok_isporuke: ponuda.rok_isporuke || null,
    nacin_placanja: ponuda.nacin_placanja || null,
    napomena: ponuda.napomena || null,
    napomena_pdv: ponuda.napomena_pdv || null,
    status: ponuda.status || 'nacrt',
    stavke: ponuda.stavke
  }
}

export function PonudeProvider({ children }) {
  const [ponude, setPonude] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchInProgress = useRef(false)

  const fetchPonude = useCallback(async (year, month, status, force = false) => {
    if (fetchInProgress.current && !force) return

    fetchInProgress.current = true
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.set('godina', year || new Date().getFullYear())
      if (month && month !== 'all') params.set('mesec', month)
      if (status && status !== 'all') params.set('status', status)
      params.set('per_page', '500')
      const res = await apiCall(`${API.ponude.list}?${params}`)
      const data = res.data
      const items = data?.data ?? (Array.isArray(data) ? data : [])
      setPonude(items.map(apiToPonuda))
      setIsInitialized(true)
    } catch (err) {
      console.error('Error loading ponude:', err)
      setError(err?.message || 'Greška pri učitavanju')
      setPonude([])
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [])

  const location = useLocation()
  useEffect(() => {
    const isOnPonudePage = location.pathname === '/admin/cenovnik' ||
      location.pathname === '/admin/obracun-ponude' ||
      location.pathname === '/admin/kreiranje-ponude'
    const isAuth = localStorage.getItem('auth_token')
    if (!isOnPonudePage || !isAuth) return
    if (isInitialized) return
    fetchPonude(new Date().getFullYear(), null, null, true)
  }, [location.pathname, isInitialized, fetchPonude])

  const addPonuda = async (ponuda) => {
    try {
      const payload = ponudaToApi(ponuda)
      const res = await apiCall(API.ponude.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const newPonuda = apiToPonuda(res.data)
      setPonude(prev => [newPonuda, ...prev])
      return newPonuda
    } catch (err) {
      console.error('Error adding ponuda:', err)
      throw err
    }
  }

  const updatePonuda = async (id, updates) => {
    try {
      const existing = ponude.find(p => p.id === id)
      if (!existing) return

      const payload = ponudaToApi({ ...existing, ...updates })
      const res = await apiCall(API.ponude.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToPonuda(res.data)
      setPonude(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      console.error('Error updating ponuda:', err)
      throw err
    }
  }

  const deletePonuda = async (id) => {
    try {
      await apiCall(API.ponude.delete(id), { method: 'DELETE' })
      setPonude(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting ponuda:', err)
      throw err
    }
  }

  const changePonudaStatus = async (id, status) => {
    try {
      await apiCall(API.ponude.status(id), {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      const existing = ponude.find(p => p.id === id)
      if (existing) {
        const updated = { ...existing, status }
        setPonude(prev => prev.map(p => p.id === id ? updated : p))
        return updated
      }
    } catch (err) {
      console.error('Error changing ponuda status:', err)
      throw err
    }
  }

  const value = {
    ponude,
    isLoading,
    error,
    fetchPonude,
    addPonuda,
    updatePonuda,
    deletePonuda,
    changePonudaStatus
  }

  return (
    <PonudeContext.Provider value={value}>
      {children}
    </PonudeContext.Provider>
  )
}

export function usePonude() {
  const context = useContext(PonudeContext)
  if (!context) {
    throw new Error('usePonude must be used within a PonudeProvider')
  }
  return context
}
