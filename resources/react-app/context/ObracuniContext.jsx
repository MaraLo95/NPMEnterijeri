import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { apiCall, API } from '../config/api'

const ObracuniContext = createContext()

// Map API format (obracuni_ponuda) → React format
function apiToObracun(api) {
  if (!api) return null
  const klijent = api.klijent || {}
  const ponuda = api.ponuda || {}
  return {
    id: api.id,
    broj_obracuna: api.broj_obracuna || '',
    klijent_id: api.klijent_id,
    client_id: api.klijent_id,
    client_name: klijent.naziv || '',
    ponuda_id: api.ponuda_id,
    naziv_projekta: api.naziv_projekta || '',
    datum_obracuna: api.datum_obracuna ? api.datum_obracuna.split('T')[0] : '',
    ukupna_cena_materijala: api.ukupna_cena_materijala != null ? parseFloat(api.ukupna_cena_materijala) : 0,
    profit_procenat: api.profit_procenat ?? 0,
    profit_iznos: api.profit_iznos != null ? parseFloat(api.profit_iznos) : 0,
    ukupna_cena_ponude: api.ukupna_cena_ponude != null ? parseFloat(api.ukupna_cena_ponude) : 0,
    status: api.status || 'nacrt',
    stavke: api.stavke || [],
    godina: api.datum_obracuna ? new Date(api.datum_obracuna).getFullYear() : new Date().getFullYear(),
    ponuda: ponuda,
    isNovo: api.is_novo ?? false
  }
}

// Map React format → API format (obracuni)
function obracunToApi(obracun) {
  const stavke = (obracun.stavke || []).map(s => ({
    naziv_usluge: s.naziv_usluge || '',
    jedinica_mere: s.jedinica_mere || s.jm || 'KOM',
    kolicina: parseFloat(s.kolicina) || 0,
    cena_po_jm: parseFloat(s.cena_po_jm) || 0,
    opis: s.opis || null,
    cenovnik_id: s.cenovnik_id || null
  })).filter(s => s.naziv_usluge)
  return {
    klijent_id: obracun.klijent_id,
    naziv_projekta: obracun.naziv_projekta || obracun.naziv_projekta || '',
    datum_obracuna: obracun.datum_obracuna || null,
    profit_procenat: obracun.profit_procenat ?? 0,
    stavke: stavke.length ? stavke : [{ naziv_usluge: 'Usluga', jedinica_mere: 'KOM', kolicina: 1, cena_po_jm: 0 }]
  }
}

export function ObracuniProvider({ children }) {
  const [obracuni, setObracuni] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchInProgress = useRef(false)

  const fetchObracuni = useCallback(async (year, month, status, force = false) => {
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
      const res = await apiCall(`${API.obracuni.list}?${params}`)
      const data = res.data
      const items = data?.data ?? (Array.isArray(data) ? data : [])
      setObracuni(items.map(apiToObracun))
      setIsInitialized(true)
    } catch (err) {
      console.error('Error loading obracuni:', err)
      setError(err?.message || 'Greška pri učitavanju')
      setObracuni([])
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [])

  const location = useLocation()
  useEffect(() => {
    const isOnObracuniPage = location.pathname === '/admin/obracun-ponude'
    const isAuth = localStorage.getItem('auth_token')
    if (!isOnObracuniPage || !isAuth) return
    if (isInitialized) return
    fetchObracuni(new Date().getFullYear(), null, null, true)
  }, [location.pathname, isInitialized, fetchObracuni])

  const addObracun = async (obracun) => {
    try {
      const payload = obracunToApi(obracun)
      const res = await apiCall(API.obracuni.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const data = res.data?.obracun || res.data
      const newObracun = apiToObracun(data)
      setObracuni(prev => [newObracun, ...prev])
      return newObracun
    } catch (err) {
      console.error('Error adding obracun:', err)
      throw err
    }
  }

  const updateObracun = async (id, updates) => {
    try {
      const existing = obracuni.find(o => o.id === id)
      if (!existing) return

      const payload = obracunToApi({ ...existing, ...updates })
      const res = await apiCall(API.obracuni.update(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      const updated = apiToObracun(res.data)
      setObracuni(prev => prev.map(o => o.id === id ? updated : o))
      return updated
    } catch (err) {
      console.error('Error updating obracun:', err)
      throw err
    }
  }

  const deleteObracun = async (id) => {
    try {
      await apiCall(API.obracuni.delete(id), { method: 'DELETE' })
      setObracuni(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      console.error('Error deleting obracun:', err)
      throw err
    }
  }

  const changeObracunStatus = async (id, status) => {
    try {
      await apiCall(API.obracuni.status(id), {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      const existing = obracuni.find(o => o.id === id)
      if (existing) {
        const updated = { ...existing, status }
        setObracuni(prev => prev.map(o => o.id === id ? updated : o))
        return updated
      }
    } catch (err) {
      console.error('Error changing obracun status:', err)
      throw err
    }
  }

  const value = {
    obracuni,
    isLoading,
    error,
    fetchObracuni,
    addObracun,
    updateObracun,
    deleteObracun,
    changeObracunStatus
  }

  return (
    <ObracuniContext.Provider value={value}>
      {children}
    </ObracuniContext.Provider>
  )
}

export function useObracuni() {
  const context = useContext(ObracuniContext)
  if (!context) {
    throw new Error('useObracuni must be used within an ObracuniProvider')
  }
  return context
}
