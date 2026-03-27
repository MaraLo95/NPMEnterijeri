import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/admin/AdminLayout'
import { useClients } from '../../context/ClientsContext'
import { useObracuni } from '../../context/ObracuniContext'
import { apiCall, API } from '../../config/api'
import './AdminStyles.css'

function AdminObracunPonude() {
  const navigate = useNavigate()
  const { clients } = useClients()
  const { obracuni, isLoading: obracuniLoading, fetchObracuni, addObracun } = useObracuni()
  const [filteredPonude, setFilteredPonude] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPonuda, setEditingPonuda] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  
  const [cenovnikItems, setCenovnikItems] = useState([])
  
  // Empty rows for Excel-like table
  const createEmptyStavke = () => Array(6).fill(null).map(() => ({ 
    naziv_usluge: '', 
    jedinica_mere: '', 
    kolicina: '', 
    cena_po_jm: '', 
    opis: '' 
  }))
  
  const [formData, setFormData] = useState({
    datum_ponude: new Date().toISOString().split('T')[0],
    klijent_id: '',
    naziv_projekta: '',
    stavke: createEmptyStavke()
  })
  
  // Selected profit percentage for final price
  const [selectedProfitPercent, setSelectedProfitPercent] = useState(null)
  const [ukupnaCenaPonude, setUkupnaCenaPonude] = useState(0)

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) navigate('/admin/login')
  }, [navigate])

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      apiCall(`${API.cenovnik.list}?all=true`)
        .then(res => {
          const data = res.data
          const items = Array.isArray(data) ? data : (data?.data || [])
          setCenovnikItems(items.map(c => ({
            id: c.id,
            vrsta_usluge: c.vrsta_usluge || '',
            cena_eur: parseFloat(c.cena_eur) || 0
          })))
        })
        .catch(() => setCenovnikItems([]))
    }
  }, [])

  // Map clients for dropdown (ime = companyName)
  const clientsMapped = clients.map(c => ({
    id: c.id,
    ime: c.companyName,
    email: c.email
  }))

  // Map obracuni to display format (ponude-like for the list)
  const displayPonude = obracuni.map(o => ({
    ...o,
    broj_ponude: o.broj_obracuna,
    datum_ponude: o.datum_obracuna,
    naziv_ponude: o.naziv_projekta,
    ukupna_cena_bez_pdv: o.ukupna_cena_materijala,
    ukupna_cena_sa_procentima: o.ukupna_cena_ponude,
    stavke_count: (o.stavke || []).length
  }))

  const ponude = displayPonude

  // Filter ponude
  useEffect(() => {
    let filtered = ponude.filter(p => p.godina === selectedYear)
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(p => new Date(p.datum_ponude).getMonth() + 1 === parseInt(selectedMonth))
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus)
    }
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.naziv_ponude.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.broj_ponude.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredPonude(filtered)
  }, [ponude, selectedYear, selectedMonth, selectedStatus, searchTerm])

  // Calculate totals
  const calculateStavkaTotals = () => {
    return formData.stavke.reduce((sum, s) => {
      const kolicina = parseFloat(s.kolicina) || 0
      const cena = parseFloat(s.cena_po_jm) || 0
      return sum + (kolicina * cena)
    }, 0)
  }

  const calculateProfit = (percentage) => {
    return calculateStavkaTotals() * (percentage / 100)
  }

  const generateNextBrojPonude = () => {
    const yearPonude = ponude.filter(p => p.godina === selectedYear)
    const maxNum = yearPonude.reduce((max, p) => {
      const num = parseInt(p.broj_ponude.split('/')[0])
      return num > max ? num : max
    }, 0)
    return `${String(maxNum + 1).padStart(5, '0')}/${selectedYear}`
  }

  const handleNewPonuda = () => {
    setEditingPonuda(null)
    setFormData({
      datum_ponude: new Date().toISOString().split('T')[0],
      klijent_id: '',
      naziv_projekta: '',
      stavke: createEmptyStavke()
    })
    setSelectedProfitPercent(null)
    setUkupnaCenaPonude(0)
    setViewMode('form')
  }
  
  // Handle profit button click - add selected profit to total price
  const handleProfitSelect = (percent) => {
    const materijal = calculateStavkaTotals()
    const profitAmount = materijal * (percent / 100)
    const totalPrice = materijal + profitAmount
    setSelectedProfitPercent(percent)
    setUkupnaCenaPonude(totalPrice)
  }

  const handleEditPonuda = (ponuda) => {
    setEditingPonuda(ponuda)
    setFormData({
      datum_ponude: ponuda.datum_ponude,
      klijent_id: ponuda.client_id || '',
      naziv_projekta: ponuda.naziv_projekta || '',
      stavke: [
        { naziv_usluge: 'Montaza stola', jedinica_mere: '1', kolicina: '1', cena_po_jm: '3000', opis: '' },
        { naziv_usluge: 'Izrada frontova za sudoperu', jedinica_mere: '1', kolicina: '2', cena_po_jm: '4000', opis: '' },
        { naziv_usluge: '', jedinica_mere: '', kolicina: '', cena_po_jm: '', opis: '' },
        { naziv_usluge: '', jedinica_mere: '', kolicina: '', cena_po_jm: '', opis: '' },
        { naziv_usluge: '', jedinica_mere: '', kolicina: '', cena_po_jm: '', opis: '' },
        { naziv_usluge: '', jedinica_mere: '', kolicina: '', cena_po_jm: '', opis: '' },
      ]
    })
    setSelectedProfitPercent(ponuda.profit_procenat || null)
    setUkupnaCenaPonude(ponuda.ukupna_cena_sa_procentima || 0)
    setViewMode('form')
  }

  const handleAddStavka = () => {
    setFormData({
      ...formData,
      stavke: [...formData.stavke, { naziv_usluge: '', jedinica_mere: '', kolicina: '', cena_po_jm: '', opis: '' }]
    })
  }

  const handleStavkaChange = (index, field, value) => {
    const newStavke = [...formData.stavke]
    newStavke[index] = { ...newStavke[index], [field]: value }
    setFormData({ ...formData, stavke: newStavke })
  }

  // Exchange rate EUR to RSD
  const EUR_TO_RSD = 117

  const handleSelectFromCenovnik = (index, cenovnikId) => {
    const item = cenovnikItems.find(c => c.id === parseInt(cenovnikId))
    if (item) {
      const newStavke = [...formData.stavke]
      // Convert EUR price to RSD and set both name and price
      const cenaRsd = Math.round(item.cena_eur * EUR_TO_RSD)
      newStavke[index] = { 
        ...newStavke[index], 
        naziv_usluge: item.vrsta_usluge,
        cena_po_jm: cenaRsd.toString()
      }
      setFormData({ ...formData, stavke: newStavke })
    }
  }

  const handleSavePonuda = () => {
    const filledStavke = formData.stavke.filter(s => s.naziv_usluge.trim() !== '')
    const selectedClient = clientsMapped.find(c => c.id === parseInt(formData.klijent_id))
    const clientName = selectedClient ? selectedClient.ime : 'Nepoznat klijent'
    const brojPonude = editingPonuda ? editingPonuda.broj_ponude : generateNextBrojPonude()
    const ukupnaCenaMaterijala = calculateStavkaTotals()
    const ukupnaCenaSaProcentima = ukupnaCenaPonude > 0 ? ukupnaCenaPonude : ukupnaCenaMaterijala
    
    const newObracun = {
      id: editingPonuda ? editingPonuda.id : ponude.length + 1,
      broj_ponude: brojPonude,
      godina: selectedYear,
      naziv_ponude: formData.naziv_projekta || `Obračun ${brojPonude}`,
      naziv_projekta: formData.naziv_projekta,
      datum_ponude: formData.datum_ponude,
      status: editingPonuda ? editingPonuda.status : 'nacrt',
      ukupna_cena_bez_pdv: ukupnaCenaMaterijala,
      ukupna_cena_sa_procentima: ukupnaCenaSaProcentima,
      profit_procenat: selectedProfitPercent,
      ukupan_trosak: 0,
      client_id: parseInt(formData.klijent_id) || null,
      client_name: clientName,
      stavke_count: filledStavke.length,
      isNovo: !editingPonuda // Mark as new if creating new obračun
    }
    
    if (editingPonuda) {
      setPonude(ponude.map(p => p.id === editingPonuda.id ? newObracun : p))
    } else {
      setPonude([...ponude, newObracun])
      
      // Auto-create ponuda in localStorage for "Kreiranje Ponude" page
      const existingPonude = JSON.parse(localStorage.getItem('kreiranje_ponude') || '[]')
      const newKreiranjePonuda = {
        id: Date.now(),
        obracun_broj: brojPonude,
        broj_ponude: brojPonude,
        godina: selectedYear,
        naziv_projekta: formData.naziv_projekta,
        datum_ponude: formData.datum_ponude,
        status: 'nacrt',
        ukupna_cena: ukupnaCenaSaProcentima,
        client_id: parseInt(formData.klijent_id) || null,
        client_name: clientName,
        stavke: filledStavke,
        isNovo: true
      }
      localStorage.setItem('kreiranje_ponude', JSON.stringify([...existingPonude, newKreiranjePonuda]))
    }
    
    setViewMode('list')
  }

  const handleDeletePonuda = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu ponudu?')) {
      setPonude(ponude.filter(p => p.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setPonude(ponude.map(p => p.id === id ? { ...p, status: newStatus } : p))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      nacrt: { label: 'Nacrt', class: 'status-nacrt', icon: 'bi-file-earmark' },
      poslata: { label: 'Poslata', class: 'status-poslata', icon: 'bi-send' },
      prihvacena: { label: 'Prihvaćena', class: 'status-prihvacena', icon: 'bi-check-circle' },
      odbijena: { label: 'Odbijena', class: 'status-odbijena', icon: 'bi-x-circle' },
      istekla: { label: 'Istekla', class: 'status-istekla', icon: 'bi-clock-history' },
      realizovana: { label: 'Realizovana', class: 'status-realizovana', icon: 'bi-trophy' }
    }
    const config = statusConfig[status] || statusConfig.nacrt
    return (
      <span className={`ponuda-status-badge ${config.class}`}>
        <i className={`bi ${config.icon}`}></i>
        {config.label}
      </span>
    )
  }

  const stats = {
    total: filteredPonude.length,
    prihvacena: filteredPonude.filter(p => p.status === 'prihvacena').length,
    ukupnaVrednost: filteredPonude.reduce((sum, p) => sum + p.ukupna_cena_bez_pdv, 0),
    ukupanProfit: filteredPonude.reduce((sum, p) => sum + p.ukupna_cena_bez_pdv, 0)
  }

  const months = [
    { value: 'all', label: 'Svi meseci' },
    { value: '1', label: 'Januar' }, { value: '2', label: 'Februar' },
    { value: '3', label: 'Mart' }, { value: '4', label: 'April' },
    { value: '5', label: 'Maj' }, { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' }, { value: '8', label: 'Avgust' },
    { value: '9', label: 'Septembar' }, { value: '10', label: 'Oktobar' },
    { value: '11', label: 'Novembar' }, { value: '12', label: 'Decembar' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <AdminLayout>
      <div className="admin-obracun-ponude">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Page Header */}
              <div className="page-header">
                <div>
                  <h1>Obračun ponude</h1>
                  <p>Pregled i upravljanje ponudama</p>
                </div>
                <button className="btn-add" onClick={handleNewPonuda}>
                  <i className="bi bi-plus-lg"></i>
                  Kreiraj novu ponudu
                </button>
              </div>

              {/* Statistics */}
              <div className="ponude-stats-grid">
                <div className="ponuda-stat-card">
                  <div className="stat-icon total"><i className="bi bi-file-earmark-text"></i></div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Ukupno ponuda</span>
                  </div>
                </div>
                <div className="ponuda-stat-card">
                  <div className="stat-icon prihvacena"><i className="bi bi-check-circle"></i></div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.prihvacena}</span>
                    <span className="stat-label">Prihvaćenih</span>
                  </div>
                </div>
                <div className="ponuda-stat-card">
                  <div className="stat-icon vrednost"><i className="bi bi-cash-stack"></i></div>
                  <div className="stat-info">
                    <span className="stat-value">Дін. {formatCurrency(stats.ukupnaVrednost)}</span>
                    <span className="stat-label">Ukupna vrednost</span>
                  </div>
                </div>
                <div className="ponuda-stat-card">
                  <div className="stat-icon profit"><i className="bi bi-graph-up-arrow"></i></div>
                  <div className="stat-info">
                    <span className="stat-value">Дін. {formatCurrency(stats.ukupanProfit)}</span>
                    <span className="stat-label">Očekivani profit</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="ponude-filters">
                <div className="filter-group">
                  <label>Godina</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                    <option value={2035}>2035</option>
                    <option value={2034}>2034</option>
                    <option value={2033}>2033</option>
                    <option value={2032}>2032</option>
                    <option value={2031}>2031</option>
                    <option value={2030}>2030</option>
                    <option value={2029}>2029</option>
                    <option value={2028}>2028</option>
                    <option value={2027}>2027</option>
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Mesec</label>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="all">Svi statusi</option>
                    <option value="nacrt">Nacrt</option>
                    <option value="poslata">Poslata</option>
                    <option value="prihvacena">Prihvaćena</option>
                    <option value="odbijena">Odbijena</option>
                    <option value="realizovana">Realizovana</option>
                  </select>
                </div>
                <div className="filter-group search">
                  <label>Pretraga</label>
                  <div className="search-input-wrapper">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Pretraži..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Ponude Grid */}
              <div className="ponude-grid">
                {filteredPonude.length === 0 ? (
                  <div className="no-ponude">
                    <i className="bi bi-inbox"></i>
                    <h3>Nema ponuda</h3>
                    <p>Kreirajte novu ponudu.</p>
                  </div>
                ) : (
                  filteredPonude.map((ponuda, index) => (
                    <motion.div key={ponuda.id} className="ponuda-card"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <div className="ponuda-card-header">
                        <div className="ponuda-broj">
                          <span className="label">Ponuda</span>
                          <span className="broj">{ponuda.broj_ponude}</span>
                        </div>
                        <div className="header-badges">
                          {ponuda.isNovo && <span className="novo-badge">NOVO</span>}
                          {getStatusBadge(ponuda.status)}
                        </div>
                      </div>
                      <div className="ponuda-card-body">
                        <h3>{ponuda.naziv_ponude}</h3>
                        {ponuda.naziv_projekta && <p className="projekt-name">{ponuda.naziv_projekta}</p>}
                        <div className="ponuda-meta">
                          <span><i className="bi bi-building"></i> {ponuda.client_name}</span>
                          <span><i className="bi bi-calendar3"></i> {new Date(ponuda.datum_ponude).toLocaleDateString('sr-RS')}</span>
                        </div>
                      </div>
                      <div className="ponuda-card-footer">
                        <div className="ponuda-amounts">
                          <div className="amount-item">
                            <span className="label">Vrednost</span>
                            <span className="value">
                              Дін. {formatCurrency(ponuda.ukupna_cena_bez_pdv)}
                              {ponuda.ukupna_cena_sa_procentima && ponuda.ukupna_cena_sa_procentima !== ponuda.ukupna_cena_bez_pdv && (
                                <span className="value-with-profit"> ({formatCurrency(ponuda.ukupna_cena_sa_procentima)})</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="ponuda-actions">
                          <button className="action-btn edit" onClick={() => handleEditPonuda(ponuda)} title="Izmeni">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeletePonuda(ponuda.id)} title="Obriši">
                            <i className="bi bi-trash"></i>
                          </button>
                          <div className="status-dropdown">
                            <select value={ponuda.status} onChange={(e) => handleStatusChange(ponuda.id, e.target.value)}>
                              <option value="nacrt">Nacrt</option>
                              <option value="poslata">Poslata</option>
                              <option value="prihvacena">Prihvaćena</option>
                              <option value="odbijena">Odbijena</option>
                              <option value="realizovana">Realizovana</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ponuda-form-view">
              {/* Form Header */}
              <div className="page-header form-header">
                <button className="btn-back" onClick={() => setViewMode('list')}>
                  <i className="bi bi-arrow-left"></i> Nazad
                </button>
                <div className="header-title">
                  <h1 className="excel-title">OBRAČUN PONUDE</h1>
                  <div className="ponuda-number">PONUDA /{selectedYear}</div>
                </div>
                <button className="btn-save" onClick={handleSavePonuda}>
                  <i className="bi bi-check-lg"></i> Sačuvaj ponudu
                </button>
              </div>

              {/* Form Content - Excel Style */}
              <div className="ponuda-form-content excel-style">
                {/* Form Fields Row */}
                <div className="form-fields-row">
                  <div className="form-field">
                    <span className="field-label">Klijent:</span>
                    <select 
                      value={formData.klijent_id} 
                      onChange={(e) => setFormData({ ...formData, klijent_id: e.target.value })}
                      className="client-dropdown"
                    >
                      <option value="">-- Izaberi klijenta --</option>
                      {clientsMapped.map(client => (
                        <option key={client.id} value={client.id}>{client.ime}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <span className="field-label">Naziv projekta:</span>
                    <input 
                      type="text" 
                      value={formData.naziv_projekta} 
                      onChange={(e) => setFormData({ ...formData, naziv_projekta: e.target.value })}
                      placeholder="Unesite naziv projekta..."
                      className="projekt-input"
                    />
                  </div>
                  <div className="form-field">
                    <span className="field-label">Datum ponude:</span>
                    <input type="date" value={formData.datum_ponude} onChange={(e) => setFormData({ ...formData, datum_ponude: e.target.value })} className="datum-input" />
                  </div>
                </div>

                {/* Excel Table */}
                <div className="excel-table-container">
                  <table className="excel-table">
                    <thead>
                      <tr>
                        <th className="col-naziv">Naziv usluge</th>
                        <th className="col-jm">J.M.</th>
                        <th className="col-kolicina">Količina</th>
                        <th className="col-cena">Cena usluge po J.M. (RSD)</th>
                        <th className="col-ukupno">Ukupna cena usluge bez PDV (RSD)</th>
                        <th className="col-opis">Opis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.stavke.map((stavka, index) => {
                        const kolicina = parseFloat(stavka.kolicina) || 0
                        const cena = parseFloat(stavka.cena_po_jm) || 0
                        const ukupno = kolicina * cena
                        return (
                          <tr key={index}>
                            <td className="col-naziv">
                              <div className="naziv-cell">
                                <select onChange={(e) => handleSelectFromCenovnik(index, e.target.value)} className="cenovnik-mini-select" title="Izaberi iz cenovnika">
                                  <option value="">▼</option>
                                  {cenovnikItems.map(item => <option key={item.id} value={item.id}>{item.vrsta_usluge}</option>)}
                                </select>
                                <input type="text" value={stavka.naziv_usluge} onChange={(e) => handleStavkaChange(index, 'naziv_usluge', e.target.value)} className="excel-cell" />
                              </div>
                            </td>
                            <td className="col-jm">
                              <input type="text" value={stavka.jedinica_mere} onChange={(e) => handleStavkaChange(index, 'jedinica_mere', e.target.value)} className="excel-cell center" />
                            </td>
                            <td className="col-kolicina">
                              <input type="text" value={stavka.kolicina} onChange={(e) => handleStavkaChange(index, 'kolicina', e.target.value)} className="excel-cell center" />
                            </td>
                            <td className="col-cena">
                              <input type="text" value={stavka.cena_po_jm} onChange={(e) => handleStavkaChange(index, 'cena_po_jm', e.target.value)} className="excel-cell right" />
                            </td>
                            <td className="col-ukupno">
                              <span className="excel-calculated">{ukupno > 0 ? formatCurrency(ukupno) : '0'}</span>
                            </td>
                            <td className="col-opis">
                              <input type="text" value={stavka.opis} onChange={(e) => handleStavkaChange(index, 'opis', e.target.value)} className="excel-cell" />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <button className="btn-add-row" onClick={handleAddStavka}><i className="bi bi-plus"></i> Dodaj red</button>
                </div>

                {/* Material Total Row */}
                <div className="excel-total-section">
                  <div className="total-row material-total">
                    <span className="total-label">Ukupan iznos materijala:</span>
                    <span className="total-value">{formatCurrency(calculateStavkaTotals())}</span>
                  </div>
                </div>

                {/* Profit Buttons */}
                <div className="profit-buttons-section">
                  <span className="profit-buttons-label">Izaberi procenat profita:</span>
                  <div className="profit-buttons-grid">
                    {[100, 90, 80, 70, 60, 50].map(percent => (
                      <button
                        key={percent}
                        className={`profit-btn ${selectedProfitPercent === percent ? 'active' : ''}`}
                        onClick={() => handleProfitSelect(percent)}
                      >
                        <span className="percent-label">Profit {percent}%</span>
                        <span className="percent-value">+ Дін. {formatCurrency(calculateProfit(percent))}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Price Total */}
                <div className="excel-total-section final-total">
                  <div className="total-row final-price-row">
                    <span className="total-label">UKUPNA CENA PONUDE:</span>
                    <span className="total-value final-value">
                      Дін. {formatCurrency(ukupnaCenaPonude > 0 ? ukupnaCenaPonude : calculateStavkaTotals())}
                    </span>
                  </div>
                  {selectedProfitPercent && (
                    <div className="profit-breakdown">
                      <span>Materijal: Дін. {formatCurrency(calculateStavkaTotals())}</span>
                      <span>+ Profit {selectedProfitPercent}%: Дін. {formatCurrency(calculateProfit(selectedProfitPercent))}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminObracunPonude
