// Gestione Google Calendar API

import { google } from 'googleapis';
import { info, warn, logError, debug, logObject, logFullError } from '@/lib/logger';
import { describeSolution, describeExtra, getSolution, formatPrice, calcolaTotale } from '@/config/prices';

let calendarClient = null;

// Configurazione retry per Google Calendar
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

/**
 * Crea un client OAuth2 con refresh token
 */
export async function getCalendarClient() {
  if (calendarClient) return calendarClient;
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  
  debug('Configurazione Google Calendar in corso');
  
  if (!clientId || !clientSecret || !refreshToken || !calendarId) {
    logError('Configurazione Google Calendar incompleta. Verifica le variabili d\'ambiente.');
    throw new Error('Configurazione Google Calendar incompleta. Verifica le variabili d\'ambiente.');
  }
  
  debug('Credentiali trovate, creazione OAuth2 client...');
  
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/auth/callback'
  );
  
  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    // Verifica che il token sia valido
    debug('Verifica token di accesso...');
    const tokenInfo = await oauth2Client.getAccessToken();
    
    if (!tokenInfo || !tokenInfo.token) {
      logError('Impossibile ottenere token di accesso. Rinfrescare il token Google.');
      throw new Error('Impossibile ottenere token di accesso. Rinfrescare il token Google.');
    }
    
    debug('Token validato con successo');
    calendarClient = { 
      client: oauth2Client, 
      calendar: google.calendar({ version: 'v3', auth: oauth2Client }), 
      calendarId 
    };
    
    return calendarClient;
  } catch (err) {
    logFullError(err, { context: 'getCalendarClient' });
    throw new Error(`Autenticazione Google fallita: ${err.message || 'Errore sconosciuto'}`);
  }
}

/**
 * Verifica la connessione a Google Calendar
 */
export async function verifyCalendarConnection() {
  try {
    const client = await getCalendarClient();
    
    // Prova a fare una richiesta semplice (list events)
    const response = await client.calendar.events.list({
      calendarId: client.calendarId,
      maxResults: 1,
      timeMin: new Date().toISOString(),
      singleEvents: true
    });
    
    info('Connessione Google Calendar verificata con successo');
    return { success: true, message: 'Google Calendar è raggiungibile' };
  } catch (err) {
    logFullError(err, { context: 'verifyCalendarConnection' });
    return { 
      success: false, 
      message: `Impossibile connettersi a Google Calendar: ${err.message}` 
    };
  }
}

/**
 * Crea un evento su Google Calendar con retry automatico
 */
export async function createCalendarEvent(eventData) {
  const client = await getCalendarClient();
  
  debug('Creazione evento Google Calendar', { eventId: eventData.email });
  
  // Formatta l'evento
  const event = formatCalendarEvent(eventData);
  
  // Retry loop per gestire errori temporanei
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      debug(`Tentativo creazione evento (${attempt + 1}/${MAX_RETRIES + 1})`);
      
      const response = await client.calendar.events.insert({
        calendarId: client.calendarId,
        resource: event
      });
      
      info('Evento creato con successo su Google Calendar', { 
        eventId: response.data.id,
        htmlLink: response.data.htmlLink
      });
      
      return {
        success: true,
        eventId: response.data.id,
        eventUrl: response.data.htmlLink,
        summary: response.data.summary,
        start: response.data.start.dateTime || response.data.start.date
      };
      
    } catch (calendarError) {
      logFullError(calendarError, { 
        context: 'createCalendarEvent',
        attempt: attempt + 1,
        eventData: { email: eventData.email, tipoEvento: eventData.tipoEvento }
      });
      
      if (attempt < MAX_RETRIES) {
        debug(`Riprovo tra ${RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        throw new Error(`Errore creazione evento Google Calendar dopo ${MAX_RETRIES + 1} tentativi: ${calendarError.message}`);
      }
    }
  }
}

/**
 * Il giorno dopo, in formato "YYYY-MM-DD".
 * Per Google un evento di giornata finisce il giorno successivo a quello che
 * occupa: con la stessa data in start e end l'evento non comparirebbe.
 */
function giornoDopo(dataEvento) {
  const [anno, mese, giorno] = dataEvento.split('-').map(Number);
  return new Date(Date.UTC(anno, mese - 1, giorno + 1)).toISOString().slice(0, 10);
}

/**
 * Formatta i dati del form in un evento Google Calendar
 */
function formatCalendarEvent(data) {
  // Al cliente chiedo solo mattina o sera, e l'evento occupa il giorno intero:
  // un orario di inizio e fine sarebbe inventato.
  const momento = ['Mattina', 'Sera'].includes(data.momento) ? data.momento : '';

  const righe = [];
  const r = (testo) => righe.push(testo);

  r(`Nuova prenotazione da ${data.nome} ${data.cognome}`);
  r('');
  r(`📞 Telefono: +39${data.telefono.replace(/\D/g, '')}`);
  if (data.email) r(`📧 Email: ${data.email}`);

  r('');
  r('📋 Evento');
  r(`• Tipo: ${data.tipoEvento}`);
  if (data.descrizioneAltro) r(`• Di cosa si tratta: ${data.descrizioneAltro}`);
  if (data.nomeFesteggiato) r(`• Festeggiato/a: ${data.nomeFesteggiato}`);
  if (data.numeroInvitati) r(`• Invitati: ${data.numeroInvitati}`);
  r(`• Quando: ${momento ? momento.toLowerCase() : 'non indicato'}`);
  if (data.chiesa) r(`• Chiesa: ${data.chiesa}`);
  if (data.luogo && data.luogo !== data.chiesa) r(`• Luogo: ${data.luogo}`);

  if (data.laureaTipi?.length > 0) {
    r('');
    r('🎓 Laurea');
    r(`• Tipo: ${data.laureaTipi.join(' + ')}`);
    if (data.laureaFacolta) r(`• Facoltà: ${data.laureaFacolta}`);
    if (data.laureaCitta) r(`• Città: ${data.laureaCitta}`);
    if (data.laureaOraSeduta) r(`• Ora della seduta: ${data.laureaOraSeduta}`);
    else if (data.laureaOrario) r(`• Orario seduta: ${data.laureaOrario}`);
    if (data.laureaAltriDettagli) r(`• Altro: ${data.laureaAltriDettagli}`);
  }

  // Soluzione: prima si leggeva solo l'id ("Soluzione selezionata: 18-1").
  if (data.soluzione) {
    const sol = getSolution(data.soluzione);
    r('');
    r(`📸 Soluzione scelta: ${describeSolution(data.soluzione)}`);
    if (sol?.desc) r(`   ${sol.desc}`);
  }

  // Polaroid e cartoncini sono extra come gli altri: il form li tiene solo in
  // campi separati. Qui vanno nella stessa lista, con il dettaglio di cosa sono.
  const extra = [
    ...(data.extra || []),
    data.polaroid,
    data.cartoncino,
  ].filter(Boolean);

  if (extra.length > 0) {
    r('');
    r('➕ Extra');
    for (const id of extra) r(`• ${describeExtra(id, data.quantitaCartoncini)}`);
  }

  const totale = calcolaTotale(data);
  if (totale > 0) {
    r('');
    r(`💰 Totale: ${formatPrice(totale)}`);
  }

  if (data.indirizzo || data.provenienza) r('');
  if (data.indirizzo) r(`📍 Indirizzo: ${data.indirizzo}`);
  if (data.provenienza) r(`🔗 Arriva da: ${data.provenienza}`);
  if (data.note) {
    r('');
    r('📝 Note del cliente:');
    r(data.note);
  }

  // Nel titolo va il protagonista della festa, non chi ha compilato il form.
  const chiPrenota = `${data.nome} ${data.cognome}`.trim();
  const festeggiato = (data.nomeFesteggiato || '').trim();
  const chi = festeggiato && festeggiato.toLowerCase() !== chiPrenota.toLowerCase()
    ? `${festeggiato} (prenota ${chiPrenota})`
    : chiPrenota;
  const titolo = `${momento ? `${momento} · ` : ''}${data.tipoEvento} — ${chi}`;

  return {
    summary: titolo,
    description: righe.join('\n').trim(),
    start: { date: data.dataEvento },
    end: { date: giornoDopo(data.dataEvento) },
    attendees: data.email ? [{ email: data.email, displayName: chiPrenota }] : [],
    reminders: {
      useDefault: true
    }
  };
}
