'use client'

import { useState } from 'react'
import styles from './page.module.css'

const TIPI_EVENTO = [
  'Primo Compleanno',
  'Battesimo',
  'Comunione',
  'Cresima',
  '18° Compleanno',
  '25° Anniversario di Matrimonio',
  '50° Anniversario di Matrimonio',
  'Altro',
]

const SOLUZIONI = {
  'Primo Compleanno': [
    'Soluzione 1 — Reportage completo (€230)',
    'Soluzione 2 — Sessione a casa (€200)',
    'Soluzione 3 — Solo momento torta (€100)',
  ],
  'Battesimo': [
    'Soluzione 1 — Solo celebrazione (€100)',
    'Soluzione 2 — Messa e ristorante (€240)',
    'Soluzione 3 — Giornata completa (€350)',
  ],
  '18° Compleanno': [
    'Soluzione 1 — Reportage della festa (€250)',
    'Soluzione 2 — Shooting + festa (€380)',
    'Soluzione 3 — Fino al primo ballo (€190)',
    'Soluzione 4 — Solo momento torta (€90)',
  ],
}

const EXTRA = {
  'Primo Compleanno': [
    'Fotolibro aggiuntivo (€150)',
    'Cartoncino ricordo 15×22 cm — consegna differita (€2,00 cad.)',
    'Cartoncino ricordo 15×22 cm — consegna in sala (€3,00 cad. + €50 supplemento)',
    'Cartoncino ricordo 10×15 cm — consegna differita (€1,50 cad.)',
    'Cartoncino ricordo 10×15 cm — consegna in sala (€2,00 cad. + €40 supplemento)',
    'Polaroid aggiuntive — fino a 100 stampe (€160)',
    'Polaroid solo momento torta — fino a 20 stampe (€80)',
    'Polaroid solo momento torta su cartoncino personalizzato — fino a 20 stampe (€120)',
  ],
  'Battesimo': [
    'Fotolibro aggiuntivo (€180)',
    'Cartoncino ricordo 15×22 cm — consegna differita (€2,00 cad.)',
    'Cartoncino ricordo 15×22 cm — consegna in sala (€3,00 cad. + €50 supplemento)',
    'Cartoncino ricordo 10×15 cm — consegna differita (€1,50 cad.)',
    'Cartoncino ricordo 10×15 cm — consegna in sala (€2,00 cad. + €40 supplemento)',
    'Polaroid aggiuntive — fino a 100 stampe (€150)',
    'Polaroid solo momento torta — fino a 20 stampe (€80)',
    'Polaroid solo momento torta su cartoncino personalizzato — fino a 20 stampe (€120)',
  ],
  '18° Compleanno': [
    'Fotolibro aggiuntivo (€150)',
    'Cartoncino ricordo 15×22 cm — consegna differita (€2,00 cad.)',
    'Cartoncino ricordo 15×22 cm — consegna in sala (€3,00 cad. + €50 supplemento)',
    'Cartoncino ricordo 10×15 cm — consegna differita (€1,50 cad.)',
    'Cartoncino ricordo 10×15 cm — consegna in sala (€2,00 cad. + €40 supplemento)',
    'Polaroid aggiuntive — fino a 100 stampe (€150)',
    'Polaroid solo momento torta — fino a 20 stampe (€70)',
  ],
  '25° Anniversario di Matrimonio': [
    'Fotolibro 30×30 cm (€250)',
    'Copertura fotografica estesa della festa (€120)',
    'Cartoncino ricordo 15×22 cm — consegna differita (€2,00 cad.)',
    'Cartoncino ricordo 15×22 cm — consegna in sala (€3,00 cad. + €50 supplemento)',
    'Cartoncino ricordo 10×15 cm — consegna differita (€1,50 cad.)',
    'Cartoncino ricordo 10×15 cm — consegna in sala (€2,00 cad. + €40 supplemento)',
  ],
}

// Soluzioni che prevedono sessione a casa
const SOLUZIONI_CON_CASA = [
  'Soluzione 2 — Sessione a casa (€200)',       // Primo Compleanno
  'Soluzione 3 — Giornata completa (€350)',      // Battesimo
]

export default function Home() {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    tipoEvento: '',
    chiesa: '',
    dataEvento: '',
    luogo: '',
    soluzione: '',
    extra: [],
    polaroid: '',
    indirizzo: '',
    note: '',
  })
  const [stato, setStato] = useState('idle') // idle | loading | success | error
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [errore, setErrore] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tipoEvento' ? { soluzione: '', chiesa: '', extra: [], polaroid: '', indirizzo: '' } : {}),
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
    setForm(prev => ({
      ...prev,
      polaroid: prev.polaroid === val ? '' : val,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStato('loading')
    setErrore('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Errore sconosciuto')

      setWhatsappUrl(data.whatsappUrl)
      setStato('success')
    } catch (err) {
      setErrore(err.message)
      setStato('error')
    }
  }

  const soluzioniDisponibili = SOLUZIONI[form.tipoEvento] || []
  const tuttiExtra = EXTRA[form.tipoEvento] || []
  const extraFotolibro = tuttiExtra.filter(e => e.startsWith('Fotolibro'))
  const extraPolaroid = tuttiExtra.filter(e => e.startsWith('Polaroid'))
  const mostraIndirizzo = SOLUZIONI_CON_CASA.includes(form.soluzione)

  if (stato === 'success') {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Richiesta ricevuta</h1>
          <p className={styles.successMsg}>
            Richiesta inviata! Clicca qui sotto per contattarmi su WhatsApp: troverai già il messaggio con tutti i dettagli pronto da inviare.
          </p>
          <p className={styles.successMsg} style={{fontSize:'0.9rem', marginTop:'8px'}}>
            Per modificare o cancellare la prenotazione, contattami su WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contatta il fotografo su WhatsApp
          </a>
          <button
            className={styles.btnSecondary}
            onClick={() => { setStato('idle'); setForm({ nome:'',cognome:'',telefono:'',tipoEvento:'',chiesa:'',dataEvento:'',luogo:'',soluzione:'',extra:[],polaroid:'',indirizzo:'',note:'' }) }}
          >
            Nuova prenotazione
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>

        <header className={styles.header}>
          <div className={styles.brand}>Ruggiero Dimiccoli</div>
          <div className={styles.brandSub}>Fotografia di famiglia &amp; eventi</div>
          <div className={styles.divider} />
          <h1 className={styles.title}>Prenota il tuo servizio</h1>
          <p className={styles.subtitle}>
            Compila il form con i dettagli del tuo evento. Ti contatterò su WhatsApp per confermare.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dati personali</legend>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Nome <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  placeholder="Mario"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cognome <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  type="text"
                  name="cognome"
                  value={form.cognome}
                  onChange={handleChange}
                  required
                  placeholder="Rossi"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Numero WhatsApp <span className={styles.req}>*</span></label>
              <input
                className={styles.input}
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder="3291234567"
              />

            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dettagli evento</legend>

            <div className={styles.field}>
              <label className={styles.label}>Tipo di evento <span className={styles.req}>*</span></label>
              <select
                className={styles.select}
                name="tipoEvento"
                value={form.tipoEvento}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona il tipo di evento</option>
                {TIPI_EVENTO.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {form.tipoEvento === 'Battesimo' && (
              <div className={styles.field}>
                <label className={styles.label}>Chiesa <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  type="text"
                  name="chiesa"
                  value={form.chiesa}
                  onChange={handleChange}
                  required
                  placeholder="Es. Chiesa di San Nicola, Barletta"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Data dell'evento <span className={styles.req}>*</span></label>
              <input
                className={styles.input}
                type="date"
                name="dataEvento"
                value={form.dataEvento}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Soluzione scelta <span className={styles.req}>*</span></label>
              {soluzioniDisponibili.length > 0 ? (
                <select
                  className={styles.select}
                  name="soluzione"
                  value={form.soluzione}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona la soluzione</option>
                  {soluzioniDisponibili.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  className={styles.input}
                  type="text"
                  name="soluzione"
                  value={form.soluzione}
                  onChange={handleChange}
                  required
                  placeholder="Es. Reportage completo, Solo momento torta..."
                  disabled={!form.tipoEvento}
                />
              )}
              {!form.tipoEvento && (
                <span className={styles.hint}>Seleziona prima il tipo di evento</span>
              )}
            </div>

            {tuttiExtra.length > 0 && (
              <>
                {extraFotolibro.length > 0 && (
                  <div className={styles.field}>
                    <label className={styles.label}>Extra aggiuntivi</label>
                    <div className={styles.checkboxGroup}>
                      {extraFotolibro.map(ex => (
                        <label key={ex} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={form.extra.includes(ex)}
                            onChange={() => handleExtra(ex)}
                            className={styles.checkbox}
                          />
                          {ex}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {extraPolaroid.length > 0 && (
                  <div className={styles.field}>
                    <label className={styles.label}>Polaroid</label>
                    <div className={styles.checkboxGroup}>
                      {extraPolaroid.map(ex => (
                        <label key={ex} className={styles.checkboxLabel}>
                          <input
                            type="radio"
                            name="polaroid"
                            checked={form.polaroid === ex}
                            onChange={() => handlePolaroid(ex)}
                            className={styles.checkbox}
                          />
                          {ex}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {mostraIndirizzo && (
              <div className={styles.field}>
                <label className={styles.label}>Indirizzo di casa <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  type="text"
                  name="indirizzo"
                  value={form.indirizzo}
                  onChange={handleChange}
                  required
                  placeholder="Es. Via Roma 12, Barletta"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Luogo dell'evento <span className={styles.req}>*</span></label>
              <input
                className={styles.input}
                type="text"
                name="luogo"
                value={form.luogo}
                onChange={handleChange}
                required
                placeholder="Es. Villa Rosa, Barletta"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Note aggiuntive</label>
              <textarea
                className={styles.textarea}
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={4}
                placeholder="Informazioni aggiuntive, richieste speciali, orari indicativi..."
              />
            </div>
          </fieldset>

          {stato === 'error' && (
            <div className={styles.errorBox}>
              ⚠ {errore || 'Si è verificato un errore. Riprova.'}
            </div>
          )}

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={stato === 'loading'}
          >
            {stato === 'loading' ? 'Invio in corso...' : 'Invia richiesta'}
          </button>

          <p className={styles.privacy}>
            I dati inseriti saranno utilizzati esclusivamente per la gestione della prenotazione.
          </p>

        </form>
      </div>
    </main>
  )
}
