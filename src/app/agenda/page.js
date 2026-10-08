// Le prenotazioni ricevute dal form, leggibili dal telefono.
//
// Prima bisognava aprire la dashboard di Supabase o lanciare agenda.mjs dal PC.
// La chiave segreta resta qui sul server: al browser arriva solo l'HTML.

import { leggiPrenotazioni } from '@/lib/archivio'
import styles from './agenda.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Agenda — Ruggiero Dimiccoli Fotografia' }

const VISTE = [
  { chiave: 'prossime', titolo: 'Prossime' },
  { chiave: 'passate', titolo: 'Passate' },
  { chiave: 'tutte', titolo: 'Tutte' },
]

function dataLunga(giorno) {
  if (!giorno) return 'data mancante'
  return new Date(giorno + 'T12:00:00').toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function quantoManca(giorno) {
  if (!giorno) return null
  const oggi = new Date(new Date().toISOString().slice(0, 10) + 'T12:00:00')
  const quel = new Date(giorno + 'T12:00:00')
  const giorni = Math.round((quel - oggi) / 864e5)
  if (giorni === 0) return 'oggi'
  if (giorni === 1) return 'domani'
  if (giorni > 1) return `fra ${giorni} giorni`
  return null
}

const euro = (n) => n == null ? null
  : '€ ' + (Number.isInteger(Number(n)) ? n : Number(n).toFixed(2).replace('.', ','))

export default async function Agenda({ searchParams }) {
  const quando = VISTE.some(v => v.chiave === searchParams?.quando)
    ? searchParams.quando
    : 'prossime'

  const { errore, prenotazioni } = await leggiPrenotazioni(quando)
  const totale = prenotazioni.reduce((somma, p) => somma + (Number(p.totale) || 0), 0)

  return (
    <main className={styles.main}>
      <header className={styles.testa}>
        <h1 className={styles.titolo}>Agenda</h1>
        <nav className={styles.viste}>
          {VISTE.map(v => (
            <a
              key={v.chiave}
              href={`/agenda?quando=${v.chiave}`}
              className={v.chiave === quando ? styles.vistaAttiva : styles.vista}
            >
              {v.titolo}
            </a>
          ))}
        </nav>
      </header>

      {errore && <p className={styles.errore}>{errore}</p>}

      {!errore && prenotazioni.length === 0 && (
        <p className={styles.vuoto}>
          Nessuna prenotazione{quando === 'prossime' ? ' in arrivo' : ''}.
          Ogni invio del form ne lascia una qui, da solo.
        </p>
      )}

      {prenotazioni.map(p => {
        const manca = quando !== 'passate' ? quantoManca(p.data_evento) : null
        const chiPrenota = [p.nome, p.cognome].filter(Boolean).join(' ')
        const diverso = p.nome_festeggiato
          && p.nome_festeggiato.toLowerCase() !== chiPrenota.toLowerCase()

        return (
          <article key={p.id} className={styles.scheda}>
            <div className={styles.quando}>
              <span className={styles.data}>{dataLunga(p.data_evento)}</span>
              {p.momento && <span className={styles.momento}>{p.momento}</span>}
              {manca && <span className={styles.manca}>{manca}</span>}
            </div>

            <h2 className={styles.evento}>
              {p.tipo_evento}
              {p.nome_festeggiato && <span className={styles.festeggiato}> — {p.nome_festeggiato}</span>}
            </h2>
            {p.descrizione_altro && <p className={styles.riga}>{p.descrizione_altro}</p>}

            {(p.luogo || p.chiesa) && (
              <p className={styles.riga}>{[p.chiesa, p.luogo].filter(Boolean).join(' · ')}</p>
            )}
            {p.indirizzo && <p className={styles.riga}>{p.indirizzo}</p>}

            <p className={styles.riga}>
              <span className={styles.etichetta}>{diverso ? 'prenota' : 'cliente'}</span>
              {chiPrenota}
              {p.telefono && <> · <a className={styles.contatto} href={`tel:${p.telefono.replace(/\s/g, '')}`}>{p.telefono}</a></>}
              {p.numero_invitati && <> · {p.numero_invitati} invitati</>}
            </p>
            {p.email && (
              <p className={styles.riga}>
                <a className={styles.contatto} href={`mailto:${p.email}`}>{p.email}</a>
              </p>
            )}

            {p.soluzione_nome && (
              <div className={styles.servizio}>
                <div className={styles.voce}>
                  <span>{p.soluzione_nome}</span>
                  <span className={styles.prezzo}>{euro(p.soluzione_prezzo)}</span>
                </div>
                {(p.extra_nomi || []).map((e, i) => (
                  <div key={i} className={styles.voceExtra}><span>+ {e}</span></div>
                ))}
                {p.totale != null && (
                  <div className={styles.totale}>
                    <span>Totale</span>
                    <span className={styles.prezzo}>{euro(p.totale)}</span>
                  </div>
                )}
              </div>
            )}

            {p.note && <p className={styles.note}>{p.note}</p>}
            {p.provenienza && <p className={styles.provenienza}>arriva da {p.provenienza}</p>}
          </article>
        )
      })}

      {prenotazioni.length > 0 && (
        <footer className={styles.piede}>
          {prenotazioni.length} {prenotazioni.length === 1 ? 'prenotazione' : 'prenotazioni'}
          {totale > 0 && <> · {euro(Math.round(totale * 100) / 100)} in tutto</>}
        </footer>
      )}
    </main>
  )
}
