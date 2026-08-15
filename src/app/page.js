'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { SOLUTIONS, EXTRAS, getPrice, getExtraPrice } from '@/config/prices'
import { validateForm, validatePhoneNumber, validateName } from '@/lib/validation'
import { generateWhatsAppUrl } from '@/lib/whatsapp'
import { info } from '@/lib/logger'

const TIPI_EVENTO = [
  'Primo Compleanno',
  'Battesimo',
  'Comunione',
  'Cresima',
  '18° Compleanno',
  'Laurea — Seduta',
  'Laurea — Festa',
  '25° Anniversario di Matrimonio',
  '50° Anniversario di Matrimonio',
  'Altro',
]

export default function Home() {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    tipoEvento: '',
    chiesa: '',
    laureaTipi: [],
    laureaFacolta: '',
    laureaCitta: '',
    laureaOrario: '',
    laureaOraSeduta: '',
    laureaAltriDettagli: '',
    dataEvento: '',
    oraEvento: '10:00',
    luogo: '',
    soluzione: '',
    extra: [],
    polaroid: '',
    cartoncino: '',
    indirizzo: '',
    note: '',
    quantitaCartoncini: 1,
  })
  const [stato, setStato] = useState('idle')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [errore, setErrore] = useState('')
  const [erroriForm, setErroriForm] = useState({})
  const [prezzoTotale, setPrezzoTotale] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    calcolaPrezzo()
  }, [form.soluzione, form.extra, form.polaroid, form.cartoncino])

  // Arrivo dai preventivi: precompila tipo di evento e soluzione.
  // Es. /?evento=Battesimo&soluzione=bat-2&origine=preventivo&preventivo=battesimo
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const evento = q.get('evento')
    const soluzione = q.get('soluzione')
    if (!evento) return

    setForm(prev => {
      if (!TIPI_EVENTO.includes(evento)) return prev
      const next = { ...prev, tipoEvento: evento }
      // accetta la soluzione solo se appartiene davvero a questo evento
      const disponibili = SOLUTIONS[evento] || []
      if (soluzione && disponibili.some(s => s.id === soluzione)) next.soluzione = soluzione
      return next
    })

    const origine = q.get('preventivo')
    if (origine) info('Arrivo da preventivo', { preventivo: origine, evento, soluzione })
  }, [])

  const calcolaPrezzo = () => {
    let totale = 0
    
    if (form.soluzione) {
      const price = getPrice(form.soluzione)
      if (price && typeof price === 'number') {
        totale += price
      }
    }
    
    form.extra.forEach(extraId => {
      const extraPrice = getExtraPrice(extraId)
      if (extraPrice) {
        if (extraPrice.unit && form.quantitaCartoncini) {
          totale += extraPrice.price * form.quantitaCartoncini
          if (extraPrice.surcharge) {
            totale += extraPrice.surcharge
          }
        } else if (!extraPrice.unit) {
          totale += extraPrice.price
        }
      }
    })
    
    if (form.polaroid) {
      const polaroidPrice = getExtraPrice(form.polaroid)
      if (polaroidPrice && typeof polaroidPrice.price === 'number') {
        totale += polaroidPrice.price
      }
    }
    
    if (form.cartoncino) {
      const cartoncinoPrice = getExtraPrice(form.cartoncino)
      if (cartoncinoPrice && typeof cartoncinoPrice.price === 'number') {
        totale += cartoncinoPrice.price * (form.quantitaCartoncini || 1)
        if (cartoncinoPrice.surcharge) {
          totale += cartoncinoPrice.surcharge
        }
      }
    }
    
    setPrezzoTotale(totale)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tipoEvento' ? {
        soluzione: '', chiesa: '', extra: [], polaroid: '', cartoncino: '',
        indirizzo: '', laureaTipi: [], laureaFacolta: '', laureaCitta: '',
        laureaOrario: '', laureaOraSeduta: '', laureaAltriDettagli: '', quantitaCartoncini: 1,
      } : {}),
    }))
    setErroriForm(prev => ({ ...prev, [name]: '' }))
  }

  const handleLaureaTipo = (tipo) => {
    setForm(prev => ({
      ...prev,
      laureaTipi: prev.laureaTipi.includes(tipo)
        ? prev.laureaTipi.filter(t => t !== tipo)
        : [...prev.laureaTipi, tipo],
      ...(tipo === 'Festa' && prev.laureaTipi.includes('Festa')
        ? { soluzione: '', extra: [], polaroid: '', cartoncino: '' }
        : {}),
    }))
  }

  const handleExtra = (val) => {
    setForm(prev => ({
      ...prev,
      extra: prev.extra.includes(val)
        ? prev.extra.filter(x => x !== val)
        : [...prev.extra, val],
    }))
  }

  const handlePolaroid = (val) => {
    setForm(prev => ({ ...prev, polaroid: prev.polaroid === val ? '' : val }))
  }

  const handleCartoncino = (val) => {
    setForm(prev => ({ ...prev, cartoncino: prev.cartoncino === val ? '' : val }))
  }

  const handleQuantitaCartoncini = (e) => {
    const quantita = parseInt(e.target.value) || 1
    setForm(prev => ({ ...prev, quantitaCartoncini: quantita }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const nomeValidation = validateName(form.nome?.trim(), 'Nome')
    if (!nomeValidation.valid) {
      setErroriForm(prev => ({ ...prev, nome: nomeValidation.error }))
      setErrore(nomeValidation.error)
      return
    }
    
    const cognomeValidation = validateName(form.cognome?.trim(), 'Cognome')
    if (!cognomeValidation.valid) {
      setErroriForm(prev => ({ ...prev, cognome: cognomeValidation.error }))
      setErrore(cognomeValidation.error)
      return
    }

    const { valid, errors } = validateForm(form)
    if (!valid) {
      setErroriForm(errors)
      setErrore('Correggi gli errori nel form')
      return
    }
    
    const phoneValidation = validatePhoneNumber(form.telefono)
    if (!phoneValidation.valid) {
      setErroriForm(prev => ({ ...prev, telefono: phoneValidation.error }))
      setErrore(phoneValidation.error)
      return
    }

    setIsLoading(true)
    setErrore('')
    setErroriForm({})

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      
      if (!res.ok) {
        const errorMessage = data.error || data.details || 'Errore sconosciuto'
        throw new Error(errorMessage)
      }
      
      // Mostra messaggio di successo con dettagli
      setWhatsappUrl(generateWhatsAppUrl({ ...form, telefono: phoneValidation.cleaned }))
      
      // Se Google Calendar ha creato l'evento, mostralo
      if (data.googleCalendarConnected && data.eventId) {
        info('✅ Evento creato su Google Calendar!')
      }
      
      setStato('success')
    } catch (err) {
      // Logga l'errore per debug
      console.error('Errore submit form:', err)
      
      // Estrai messaggio utente-friendly
      const errorMessage = err.message || 'Si è verificato un errore. Riprova.'
      setErrore(errorMessage)
      setStato('error')
    } finally {
      setIsLoading(false)
    }
  }

  const laureaConFesta = form.tipoEvento === 'Laurea' && form.laureaTipi.includes('Festa')
  const laureaConSeduta = form.tipoEvento === 'Laurea' && form.laureaTipi.includes('Seduta')
  const chiaveEvento = laureaConFesta ? 'Laurea — Festa' : (laureaConSeduta ? 'Laurea — Seduta' : form.tipoEvento)

  const soluzioniDisponibili = SOLUTIONS[chiaveEvento] || []
  // gli extra della laurea stanno sotto la chiave 'Laurea', non 'Laurea — Festa'
  const tuttiExtra = EXTRAS[chiaveEvento] || EXTRAS[(chiaveEvento || '').split(' — ')[0]] || []
  const extraCheckbox = tuttiExtra.filter(e => !e.label.startsWith('Polaroid') && !e.label.startsWith('Cartoncino'))
  const extraPolaroid = tuttiExtra.filter(e => e.label.startsWith('Polaroid'))
  const extraCartoncino = tuttiExtra.filter(e => e.label.startsWith('Cartoncino'))

  if (stato === 'success') {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={`${styles.successIcon} ${isLoading ? styles.loading : ''}`}>✓</div>
          <h1 className={styles.successTitle}>Richiesta ricevuta!</h1>
          <p className={styles.successMsg}>
            La tua richiesta è stata inviata con successo. Clicca qui sotto per contattarmi su WhatsApp: 
            troverai già il messaggio con tutti i dettagli pronto da inviare.
          </p>
          
          {prezzoTotale > 0 && (
            <div className={styles.successPriceBox}>
              <span className={styles.priceLabel}>Prezzo stimato:</span>
              <span className={styles.priceValue}>€{Math.round(prezzoTotale * 100) / 100}</span>
            </div>
          )}
          
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <p>Invio in corso...</p>
            </div>
          )}
          
          {!isLoading && whatsappUrl && (
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              📱 Apri WhatsApp
            </a>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.brand}>Ruggiero Dimiccoli</h1>
          <p className={styles.brandSub}>Photography</p>
          <div className={styles.divider} />
          <h2 className={styles.title}>Prenota il tuo servizio fotografico</h2>
          <p className={styles.subtitle}>
            Compila il form per richiedere un preventivo. Ti contatterò entro 24 ore per confermare i dettagli.
          </p>
        </header>

        {errore && stato !== 'error' && (
          <div className={styles.errorBanner}>
            ⚠️ {errore}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Sezione Dati Personali */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dati personali</legend>
            
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="nome" className={styles.label}>
                  Nome <span className={styles.req}>*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={erroriForm.nome ? styles.inputError : styles.input}
                  placeholder="Il tuo nome"
                  aria-invalid={!!erroriForm.nome}
                />
                {erroriForm.nome && <span className={styles.errorText}>{erroriForm.nome}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="cognome" className={styles.label}>
                  Cognome <span className={styles.req}>*</span>
                </label>
                <input
                  type="text"
                  id="cognome"
                  name="cognome"
                  value={form.cognome}
                  onChange={handleChange}
                  className={erroriForm.cognome ? styles.inputError : styles.input}
                  placeholder="Il tuo cognome"
                  aria-invalid={!!erroriForm.cognome}
                />
                {erroriForm.cognome && <span className={styles.errorText}>{erroriForm.cognome}</span>}
              </div>
            </div>
            
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="telefono" className={styles.label}>
                  Telefono <span className={styles.req}>*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className={erroriForm.telefono ? styles.inputError : styles.input}
                  placeholder="+39 333 1234567"
                  aria-invalid={!!erroriForm.telefono}
                />
                {erroriForm.telefono && <span className={styles.errorText}>{erroriForm.telefono}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email (opzionale)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={erroriForm.email ? styles.inputError : styles.input}
                  placeholder="nome@esempio.com"
                  aria-invalid={!!erroriForm.email}
                />
                {erroriForm.email && <span className={styles.errorText}>{erroriForm.email}</span>}
              </div>
            </div>
          </fieldset>

          {/* Sezione Evento */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dettagli evento</legend>
            
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="tipoEvento" className={styles.label}>
                  Tipo evento <span className={styles.req}>*</span>
                </label>
                <select
                  id="tipoEvento"
                  name="tipoEvento"
                  value={form.tipoEvento}
                  onChange={handleChange}
                  className={erroriForm.tipoEvento ? styles.inputError : styles.select}
                  aria-invalid={!!erroriForm.tipoEvento}
                >
                  <option value="">Seleziona...</option>
                  {TIPI_EVENTO.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {erroriForm.tipoEvento && <span className={styles.errorText}>{erroriForm.tipoEvento}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="oraEvento" className={styles.label}>
                  Orario evento
                </label>
                <input
                  type="time"
                  id="oraEvento"
                  name="oraEvento"
                  value={form.oraEvento}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
            
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="dataEvento" className={styles.label}>
                  Data evento <span className={styles.req}>*</span>
                </label>
                <input
                  type="date"
                  id="dataEvento"
                  name="dataEvento"
                  value={form.dataEvento}
                  onChange={handleChange}
                  className={erroriForm.dataEvento ? styles.inputError : styles.input}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
                  aria-invalid={!!erroriForm.dataEvento}
                />
                {erroriForm.dataEvento && <span className={styles.errorText}>{erroriForm.dataEvento}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="luogo" className={styles.label}>
                  Luogo evento <span className={styles.req}>*</span>
                </label>
                <input
                  type="text"
                  id="luogo"
                  name="luogo"
                  value={form.luogo}
                  onChange={handleChange}
                  className={erroriForm.luogo ? styles.inputError : styles.input}
                  placeholder="Es. Villa Rosa, Barletta"
                  aria-invalid={!!erroriForm.luogo}
                />
                {erroriForm.luogo && <span className={styles.errorText}>{erroriForm.luogo}</span>}
              </div>
            </div>

            {/* Sezione Soluzione */}
            <div className={styles.field}>
              <label htmlFor="soluzione" className={styles.label}>
                Soluzione scelta <span className={styles.req}>*</span>
              </label>
              {soluzioniDisponibili.length > 0 ? (
                <select
                  id="soluzione"
                  name="soluzione"
                  value={form.soluzione}
                  onChange={handleChange}
                  className={erroriForm.soluzione ? styles.inputError : styles.select}
                >
                  <option value="">Seleziona la soluzione</option>
                  {soluzioniDisponibili.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="soluzione"
                  value={form.soluzione}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Es. Reportage completo, Solo momento torta..."
                  disabled={!form.tipoEvento}
                />
              )}
              {!form.tipoEvento && (
                <span className={styles.hint}>Seleziona prima il tipo di evento</span>
              )}
            </div>

            {/* Sezione Extra */}
            {extraCheckbox.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>Extra (opzionali)</label>
                <div className={styles.extraGrid}>
                  {extraCheckbox.map(extra => (
                    <label key={extra.id} className={styles.extraLabel}>
                      <input
                        type="checkbox"
                        checked={form.extra.includes(extra.id)}
                        onChange={() => handleExtra(extra.id)}
                      />
                      <span>{extra.label}</span>
                      {extra.price !== 'Su preventivo' && (
                        <span className={styles.extraPrice}>+ €{extra.price}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sezione Polaroid */}
            {extraPolaroid.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>Polaroid</label>
                <select
                  value={form.polaroid}
                  onChange={(e) => handlePolaroid(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Nessuna polaroid</option>
                  {extraPolaroid.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sezione Cartoncino */}
            {extraCartoncino.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>Cartoncino ricordo</label>
                <select
                  value={form.cartoncino}
                  onChange={(e) => handleCartoncino(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Nessuno</option>
                  {extraCartoncino.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                
                {form.cartoncino && (
                  <div className={styles.quantityInput}>
                    <label htmlFor="quantitaCartoncini">Quantità:</label>
                    <input
                      type="number"
                      id="quantitaCartoncini"
                      min="1"
                      value={form.quantitaCartoncini}
                      onChange={handleQuantitaCartoncini}
                      className={styles.inputSmall}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sezione Indirizzo casa */}
            {['Soluzione 2 — Sessione a casa', 'Sessione a casa'].some(s => s === form.soluzione) && (
              <div className={styles.field}>
                <label htmlFor="indirizzo" className={styles.label}>
                  Indirizzo casa (opzionale)
                </label>
                <input
                  type="text"
                  id="indirizzo"
                  name="indirizzo"
                  value={form.indirizzo}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Indirizzo per consegna materiale"
                />
              </div>
            )}

            {/* Sezione Note */}
            <div className={styles.field}>
              <label htmlFor="note" className={styles.label}>
                Note aggiuntive
              </label>
              <textarea
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
                placeholder="Informazioni aggiuntive, richieste speciali..."
              />
            </div>

            {/* Prezzo totale */}
            <div className={styles.priceSummary}>
              <span>Prezzo stimato:</span>
              <strong>€{Math.round(prezzoTotale * 100) / 100}</strong>
            </div>
          </fieldset>

          {stato === 'error' && (
            <div className={styles.errorBox}>
              ⚠️ {errore || 'Si è verificato un errore. Riprova.'}
            </div>
          )}

          <button
            type="submit"
            className={`${styles.btnSubmit} ${isLoading ? styles.loadingBtn : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Invio in corso...
              </>
            ) : 'Invia richiesta'}
          </button>

          <p className={styles.privacy}>
            I dati inseriti saranno utilizzati esclusivamente per la gestione della prenotazione.
          </p>

        </form>
      </div>
    </main>
  )
}