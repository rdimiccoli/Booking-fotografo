// Archivio delle prenotazioni su Supabase.
//
// Prima una prenotazione esisteva solo come evento su Google Calendar e come
// mail: se la mail non partiva, il dato era perso. Qui ne resta una copia
// consultabile, con le etichette gia' risolte (non "18-1") e il payload
// completo in 'dati', cosi' nulla va perso anche se domani il form cambia.
//
// Non blocca mai la risposta al cliente: se Supabase non risponde, la
// prenotazione va avanti lo stesso e l'errore finisce nei log.

import { info, warn, logFullError } from '@/lib/logger';
import { getSolutionLabel, describeExtra, getPrice, calcolaTotale } from '@/config/prices';
import { SUPABASE_URL, SUPABASE_KEY, TABELLA_PRENOTAZIONI } from '@/config/supabase';

const TIMEOUT_MS = 5000;

const testo = (v) => {
  const s = (v ?? '').toString().trim();
  return s === '' ? null : s;
};

const numero = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const lista = (v) => (Array.isArray(v) && v.length > 0 ? v : null);

export function componiRiga(dati, eventoCalendario = null) {
  const pezzi = Math.max(1, Number(dati.quantitaCartoncini) || 1);

  // Gli extra scelti, gia' scritti per esteso: "Polaroid solo momento torta
  // — fino a 20 stampe · 70€". E' la riga che serve a distanza di mesi.
  const extraIds = [...(dati.extra || []), dati.polaroid, dati.cartoncino].filter(Boolean);

  return {
    nome: testo(dati.nome),
    cognome: testo(dati.cognome),
    telefono: testo(dati.telefono),
    email: testo(dati.email),

    tipo_evento: testo(dati.tipoEvento),
    descrizione_altro: testo(dati.descrizioneAltro),
    nome_festeggiato: testo(dati.nomeFesteggiato),
    numero_invitati: numero(dati.numeroInvitati),
    data_evento: testo(dati.dataEvento),
    momento: testo(dati.momento),
    luogo: testo(dati.luogo),
    chiesa: testo(dati.chiesa),
    indirizzo: testo(dati.indirizzo),

    laurea_tipi: lista(dati.laureaTipi),
    laurea_facolta: testo(dati.laureaFacolta),
    laurea_citta: testo(dati.laureaCitta),
    laurea_ora_seduta: testo(dati.laureaOraSeduta || dati.laureaOrario),

    soluzione: testo(dati.soluzione),
    soluzione_nome: dati.soluzione ? getSolutionLabel(dati.soluzione) : null,
    soluzione_prezzo: typeof getPrice(dati.soluzione) === 'number' ? getPrice(dati.soluzione) : null,

    extra: lista(extraIds),
    extra_nomi: lista(extraIds.map((id) => describeExtra(id, pezzi))),
    quantita_cartoncini: dati.cartoncino ? pezzi : null,
    totale: calcolaTotale(dati) || null,

    provenienza: testo(dati.provenienza),
    note: testo(dati.note),
    evento_calendario: testo(eventoCalendario),

    dati, // il form per intero: rete di sicurezza
  };
}

export async function archiviaPrenotazione(dati, eventoCalendario = null) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    warn('Supabase non configurato: la prenotazione non viene archiviata');
    return { success: false, message: 'Supabase non configurato' };
  }

  const riga = componiRiga(dati, eventoCalendario);

  const annulla = AbortSignal.timeout
    ? AbortSignal.timeout(TIMEOUT_MS)
    : undefined;

  try {
    const risposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELLA_PRENOTAZIONI}`, {
      method: 'POST',
      signal: annulla,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(riga),
    });

    if (!risposta.ok) {
      const dettaglio = await risposta.text().catch(() => '');
      throw new Error(`${risposta.status} ${dettaglio.slice(0, 300)}`);
    }

    info('Prenotazione archiviata su Supabase');
    return { success: true };
  } catch (err) {
    logFullError(err, { context: 'archiviaPrenotazione' });
    return { success: false, message: err.message };
  }
}
