import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/admin/AdminLayout'
import { useClients } from '../../context/ClientsContext'
import { usePonude } from '../../context/PonudeContext'
import './AdminStyles.css'

function AdminKreiranjePonude() {
  const navigate = useNavigate()
  const { clients } = useClients()
  const { ponude, isLoading: ponudeLoading, fetchPonude, addPonuda } = usePonude()
  const [filteredPonude, setFilteredPonude] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [editingPonuda, setEditingPonuda] = useState(null)
  const documentRef = useRef(null)

  useEffect(() => {
    const isAuth = localStorage.getItem('npm_admin_auth')
    if (!isAuth) navigate('/admin/login')
  }, [navigate])


  // Form data for the document
  const emptyStavke = () => Array(5).fill(null).map((_, i) => ({
    rb: i + 1,
    naziv_usluge: '',
    jm: 'KOM',
    kolicina: '',
    cena_po_jm: '',
    opis: ''
  }))

  const [formData, setFormData] = useState({
    broj_ponude: '',
    datum_ponude: new Date().toISOString().split('T')[0],
    rok_vazenja: '5',
    client_id: '',
    client_name: '',
    client_adresa: '',
    client_pib: '',
    client_mb: '',
    stavke: emptyStavke(),
    rok_isporuke: '',
    nacin_placanja: '',
    napomena_pdv: 'Paušalni preduzetnik nije u sistemu PDV-a, u skladu sa članom 40. Zakona o porezu na dodatu vrednost.',
    ponudu_izdao: 'Miloš Đurović'
  })

  // Company info
  const companyInfo = {
    naziv: 'Miloš Đurović PR Proizvodnja i',
    pib: '114892347',
    mb: '67933800',
    tekuci_racun: '265-1100310094017-74',
    adresa: 'Ilije Stojadinovića 28, Beograd',
    email: 'npmmontaza@gmail.com',
    telefon: '+38163559870'
  }

  // Map clients for backward compatibility (naziv, adresa, pib, mb)
  const clientsMapped = clients.map(c => ({
    id: c.id,
    naziv: c.companyName,
    adresa: c.address,
    pib: c.pib,
    mb: c.maticniBroj
  }))

  const displayPonude = ponude

  // Filter ponude
  useEffect(() => {
    let filtered = displayPonude.filter(p => p.godina === selectedYear)
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(p => new Date(p.datum_ponude).getMonth() + 1 === parseInt(selectedMonth))
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus)
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.broj_ponude.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredPonude(filtered)
  }, [displayPonude, selectedYear, selectedMonth, selectedStatus, searchTerm])

  // Calculate totals
  const calculateStavkaTotal = (stavka) => {
    const kolicina = parseFloat(stavka.kolicina) || 0
    const cena = parseFloat(stavka.cena_po_jm) || 0
    return kolicina * cena
  }

  const calculateTotal = () => {
    return formData.stavke.reduce((sum, s) => sum + calculateStavkaTotal(s), 0)
  }

  // Generate next ponuda number
  const generateNextBrojPonude = () => {
    const yearPonude = displayPonude.filter(p => p.godina === selectedYear)
    const maxNum = yearPonude.reduce((max, p) => {
      const num = parseInt(p.broj_ponude.split('/')[0])
      return num > max ? num : max
    }, 0)
    return `${String(maxNum + 1).padStart(5, '0')}/${selectedYear}`
  }

  // Handlers
  const handleNewPonuda = () => {
    setEditingPonuda(null)
    setFormData({
      broj_ponude: generateNextBrojPonude(),
      datum_ponude: new Date().toISOString().split('T')[0],
      rok_vazenja: '5',
      client_id: '',
      client_name: '',
      client_adresa: '',
      client_pib: '',
      client_mb: '',
      stavke: emptyStavke(),
      rok_isporuke: '',
      nacin_placanja: '',
      napomena_pdv: 'Paušalni preduzetnik nije u sistemu PDV-a, u skladu sa članom 40. Zakona o porezu na dodatu vrednost.',
      ponudu_izdao: 'Miloš Đurović'
    })
    setViewMode('form')
  }

  const handleEditPonuda = (ponuda) => {
    setEditingPonuda(ponuda)
    const client = clientsMapped.find(c => c.naziv === ponuda.client_name)
    setFormData({
      broj_ponude: ponuda.broj_ponude,
      datum_ponude: ponuda.datum_ponude,
      rok_vazenja: '5',
      client_id: client?.id || '',
      client_name: ponuda.client_name,
      client_adresa: client?.adresa || '',
      client_pib: client?.pib || '',
      client_mb: client?.mb || '',
      stavke: [
        { rb: 1, naziv_usluge: 'Izrada kuhinje', jm: 'KOM', kolicina: '1', cena_po_jm: '240000', opis: '' },
        { rb: 2, naziv_usluge: 'Montaza kuhinje', jm: 'KOM', kolicina: '1', cena_po_jm: '80000', opis: '' },
        { rb: 3, naziv_usluge: '', jm: 'KOM', kolicina: '', cena_po_jm: '', opis: '' },
        { rb: 4, naziv_usluge: '', jm: 'KOM', kolicina: '', cena_po_jm: '', opis: '' },
        { rb: 5, naziv_usluge: '', jm: 'KOM', kolicina: '', cena_po_jm: '', opis: '' },
      ],
      rok_isporuke: '',
      nacin_placanja: '',
      napomena_pdv: 'Paušalni preduzetnik nije u sistemu PDV-a, u skladu sa članom 40. Zakona o porezu na dodatu vrednost.',
      ponudu_izdao: 'Miloš Đurović'
    })
    setViewMode('form')
  }

  const handleClientChange = (clientId) => {
    const client = clientsMapped.find(c => c.id === parseInt(clientId))
    if (client) {
      setFormData({
        ...formData,
        client_id: client.id,
        client_name: client.naziv,
        client_adresa: client.adresa,
        client_pib: client.pib || '',
        client_mb: client.mb || ''
      })
    }
  }

  const handleStavkaChange = (index, field, value) => {
    const newStavke = [...formData.stavke]
    newStavke[index] = { ...newStavke[index], [field]: value }
    setFormData({ ...formData, stavke: newStavke })
  }

  const handleAddStavka = () => {
    const newRb = formData.stavke.length + 1
    setFormData({
      ...formData,
      stavke: [...formData.stavke, { rb: newRb, naziv_usluge: '', jm: 'KOM', kolicina: '', cena_po_jm: '', opis: '' }]
    })
  }

  const handleSavePonuda = () => {
    const filledStavke = formData.stavke.filter(s => s.naziv_usluge.trim() !== '')
    const newPonuda = {
      id: editingPonuda ? editingPonuda.id : ponude.length + 1,
      broj_ponude: formData.broj_ponude,
      godina: selectedYear,
      client_name: formData.client_name || 'Bez klijenta',
      datum_ponude: formData.datum_ponude,
      status: editingPonuda ? editingPonuda.status : 'nacrt',
      ukupna_cena: calculateTotal(),
      obracun_id: editingPonuda ? editingPonuda.obracun_id : ponude.length + 1
    }
    if (editingPonuda) {
      setPonude(ponude.map(p => p.id === editingPonuda.id ? newPonuda : p))
    } else {
      setPonude([...ponude, newPonuda])
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

  // PDF Download
  const handleDownloadPDF = async () => {
    // For now, we'll use window.print() as a simple PDF solution
    // In production, you'd use a library like jsPDF or html2pdf
    const printContent = documentRef.current
    if (printContent) {
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Ponuda ${formData.broj_ponude}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; }
              .document-container { max-width: 800px; margin: 0 auto; }
              .document-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .company-logo { font-size: 28px; font-weight: bold; color: #5a4a3a; }
              .company-logo span { color: #c9a227; }
              .company-info { font-size: 12px; line-height: 1.6; margin-top: 15px; }
              .client-section { text-align: right; }
              .client-section h3 { font-style: italic; margin-bottom: 10px; }
              .client-info { font-size: 12px; line-height: 1.8; }
              .client-info input { border: none; border-bottom: 1px solid #999; width: 200px; }
              .document-meta { display: flex; justify-content: space-between; margin: 20px 0; padding: 10px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th, .items-table td { border: 1px solid #999; padding: 8px; text-align: center; font-size: 12px; }
              .items-table th { background: #f5f5f5; font-weight: bold; }
              .items-table td:first-child { width: 30px; }
              .items-table td:nth-child(2) { text-align: left; width: 25%; }
              .total-row { font-weight: bold; background: #e8f5e9 !important; }
              .footer-section { margin-top: 30px; font-size: 12px; font-style: italic; }
              .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
              .signature-box { text-align: center; }
              .signature-line { width: 200px; border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      nacrt: { label: 'Nacrt', class: 'status-nacrt', icon: 'bi-file-earmark' },
      poslata: { label: 'Poslata', class: 'status-poslata', icon: 'bi-send' },
      prihvacena: { label: 'Prihvaćena', class: 'status-prihvacena', icon: 'bi-check-circle' },
      odbijena: { label: 'Odbijena', class: 'status-odbijena', icon: 'bi-x-circle' },
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
    ukupnaVrednost: filteredPonude.reduce((sum, p) => sum + p.ukupna_cena, 0)
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
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('sr-RS')
  }

  return (
    <AdminLayout>
      <div className="admin-kreiranje-ponude">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Page Header */}
              <div className="page-header">
                <div>
                  <h1>Kreiranje ponude</h1>
                  <p>Kreirajte i upravljajte ponudama za klijente</p>
                </div>
                <button className="btn-add" onClick={handleNewPonuda}>
                  <i className="bi bi-plus-lg"></i>
                  Nova ponuda
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
                    <span className="stat-value">RSD {formatCurrency(stats.ukupnaVrednost)}</span>
                    <span className="stat-label">Ukupna vrednost</span>
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
                        <h3>{ponuda.client_name}</h3>
                        {ponuda.naziv_projekta && <p className="projekt-name">{ponuda.naziv_projekta}</p>}
                        <div className="ponuda-meta">
                          <span><i className="bi bi-calendar3"></i> {formatDate(ponuda.datum_ponude)}</span>
                          <span><i className="bi bi-link-45deg"></i> Obračun {ponuda.obracun_broj}</span>
                        </div>
                      </div>
                      <div className="ponuda-card-footer">
                        <div className="ponuda-amounts">
                          <div className="amount-item">
                            <span className="label">Vrednost</span>
                            <span className="value">RSD {formatCurrency(ponuda.ukupna_cena)}</span>
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
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ponuda-document-view">
              {/* Form Header */}
              <div className="page-header form-header">
                <button className="btn-back" onClick={() => setViewMode('list')}>
                  <i className="bi bi-arrow-left"></i> Nazad
                </button>
                <div className="header-actions">
                  <button className="btn-download" onClick={handleDownloadPDF}>
                    <i className="bi bi-file-pdf"></i> Preuzmi PDF
                  </button>
                  <button className="btn-save" onClick={handleSavePonuda}>
                    <i className="bi bi-check-lg"></i> Sačuvaj
                  </button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="document-wrapper">
                <div className="document-container" ref={documentRef}>
                  {/* Document Header */}
                  <div className="document-header">
                    <div className="company-section">
                      <div className="company-logo">
                        <span className="logo-n">N</span><span className="logo-pm">PM</span>
                        <div className="logo-sub">E<span className="logo-n2">N</span>TERIJERI</div>
                      </div>
                      <div className="company-info">
                        <p><strong>{companyInfo.naziv}</strong></p>
                        <p>PIB: {companyInfo.pib} / MB: {companyInfo.mb}</p>
                        <p>Tekući račun: {companyInfo.tekuci_racun}</p>
                        <p>Adresa: {companyInfo.adresa}</p>
                        <p>Email: {companyInfo.email}</p>
                        <p>Telefon: {companyInfo.telefon}</p>
                      </div>
                    </div>

                    <div className="client-section">
                      <h3 className="client-title">Kupac:</h3>
                      <div className="client-form">
                        <div className="client-field">
                          <select 
                            value={formData.client_id} 
                            onChange={(e) => handleClientChange(e.target.value)}
                            className="client-select"
                          >
                            <option value="">-- Izaberi klijenta --</option>
                            {clientsMapped.map(c => (
                              <option key={c.id} value={c.id}>{c.naziv}</option>
                            ))}
                          </select>
                        </div>
                        <div className="client-field">
                          <label>Adresa:</label>
                          <input 
                            type="text" 
                            value={formData.client_adresa}
                            onChange={(e) => setFormData({...formData, client_adresa: e.target.value})}
                            placeholder="Adresa klijenta"
                          />
                        </div>
                        <div className="client-field">
                          <label>PIB:</label>
                          <input 
                            type="text" 
                            value={formData.client_pib}
                            onChange={(e) => setFormData({...formData, client_pib: e.target.value})}
                            placeholder="PIB"
                          />
                        </div>
                        <div className="client-field">
                          <label>MB:</label>
                          <input 
                            type="text" 
                            value={formData.client_mb}
                            onChange={(e) => setFormData({...formData, client_mb: e.target.value})}
                            placeholder="MB"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Meta */}
                  <div className="document-meta">
                    <div className="meta-item">
                      <span className="meta-label">Broj ponude:</span>
                      <span className="meta-value">/{selectedYear}</span>
                      <input 
                        type="text" 
                        value={formData.broj_ponude.split('/')[0]}
                        onChange={(e) => setFormData({...formData, broj_ponude: `${e.target.value}/${selectedYear}`})}
                        className="meta-input broj"
                      />
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Datum ponude:</span>
                      <input 
                        type="date" 
                        value={formData.datum_ponude}
                        onChange={(e) => setFormData({...formData, datum_ponude: e.target.value})}
                        className="meta-input"
                      />
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Rok važenja ponude:</span>
                      <input 
                        type="text" 
                        value={formData.rok_vazenja}
                        onChange={(e) => setFormData({...formData, rok_vazenja: e.target.value})}
                        className="meta-input small"
                      />
                      <span className="meta-suffix">dana</span>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>R.B.</th>
                          <th>Naziv usluge</th>
                          <th>J.M.</th>
                          <th>Količina</th>
                          <th>Cena usluge po J.M. (RSD)</th>
                          <th>Ukupna cena usluge bez PDV (RSD)</th>
                          <th>Detaljno</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.stavke.map((stavka, index) => (
                          <tr key={index}>
                            <td>{stavka.rb}</td>
                            <td>
                              <input 
                                type="text" 
                                value={stavka.naziv_usluge}
                                onChange={(e) => handleStavkaChange(index, 'naziv_usluge', e.target.value)}
                                className="table-input"
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={stavka.jm}
                                onChange={(e) => handleStavkaChange(index, 'jm', e.target.value)}
                                className="table-input center"
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={stavka.kolicina}
                                onChange={(e) => handleStavkaChange(index, 'kolicina', e.target.value)}
                                className="table-input center"
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={stavka.cena_po_jm}
                                onChange={(e) => handleStavkaChange(index, 'cena_po_jm', e.target.value)}
                                className="table-input right"
                              />
                            </td>
                            <td className="calculated">
                              {calculateStavkaTotal(stavka) > 0 ? formatCurrency(calculateStavkaTotal(stavka)) : '0'}
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={stavka.opis}
                                onChange={(e) => handleStavkaChange(index, 'opis', e.target.value)}
                                className="table-input"
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan="5" className="total-label">Ukupna cena ponude bez PDV:</td>
                          <td className="total-value">{formatCurrency(calculateTotal())}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="btn-add-row" onClick={handleAddStavka}>
                      <i className="bi bi-plus"></i> Dodaj stavku
                    </button>
                  </div>

                  {/* Footer Section */}
                  <div className="document-footer">
                    <div className="footer-field">
                      <label>Rok isporuke:</label>
                      <input 
                        type="text" 
                        value={formData.rok_isporuke}
                        onChange={(e) => setFormData({...formData, rok_isporuke: e.target.value})}
                        placeholder="Unesite rok isporuke"
                      />
                    </div>
                    <div className="footer-field">
                      <label>Način plaćanja:</label>
                      <input 
                        type="text" 
                        value={formData.nacin_placanja}
                        onChange={(e) => setFormData({...formData, nacin_placanja: e.target.value})}
                        placeholder="Unesite način plaćanja"
                      />
                    </div>
                    <div className="footer-field pdv-note">
                      <label>Napomena o PDV:</label>
                      <textarea 
                        value={formData.napomena_pdv}
                        onChange={(e) => setFormData({...formData, napomena_pdv: e.target.value})}
                        rows="2"
                      />
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="signatures-section">
                    <div className="signature-box">
                      <span className="signature-label">Ponudu izdao:</span>
                      <div className="signature-line"></div>
                      <input 
                        type="text" 
                        value={formData.ponudu_izdao}
                        onChange={(e) => setFormData({...formData, ponudu_izdao: e.target.value})}
                        className="signature-name"
                      />
                    </div>
                    <div className="signature-box">
                      <span className="signature-label">Ponudu zaprimio:</span>
                      <div className="signature-line"></div>
                      <span className="signature-name-placeholder"></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminKreiranjePonude
