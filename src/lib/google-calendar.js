// Gestione Google Calendar API

import { google } from 'googleapis';
import { info, warn, logError, debug, logObject, logFullError } from '@/lib/logger';

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
 * Formatta i dati del form in un evento Google Calendar
 */
function formatCalendarEvent(data) {
  const [year, month, day] = data.dataEvento.split('-').map(Number);
  
  // Calcola ora di inizio e fine (default: 14:00 - 18:00 se non specificato)
  let startHour = 14;
  let endHour = 18;
  
  if (data.oraEvento) {
    const [hours, minutes] = data.oraEvento.split(':').map(Number);
    startHour = hours;
    endHour = Math.min(hours + 4, 23); // Evento di max 4 ore
  }
  
  const startDate = new Date(year, month - 1, day, startHour, 0, 0);
  const endDate = new Date(year, month - 1, day, endHour, 0, 0);
  
  // Formatta la descrizione
  let description = `Nuova prenotazione da ${data.nome} ${data.cognome}\n\n`;
  description += `📞 Telefono: +39${data.telefono.replace(/\D/g, '')}\n`;
  if (data.email) description += `📧 Email: ${data.email}\n`;
  description += `\n📋 Dettagli evento:\n`;
  description += `- Tipo: ${data.tipoEvento}\n`;
  
  // Aggiungi dettagli specifici per tipo evento
  if (data.chiesa) description += `- Chiesa: ${data.chiesa}\n`;
  if (data.luogo && data.luogo !== data.chiesa) description += `- Luogo: ${data.luogo}\n`;
  
  // Dettagli laurea se presente
  if (data.tipoEvento === 'Laurea' && data.laureaTipi?.length > 0) {
    description += `\n🎓 Informazioni Laurea:\n`;
    description += `- Tipo: ${data.laureaTipi.join(' + ')}\n`;
    if (data.laureaFacolta) description += `- Facoltà: ${data.laureaFacolta}\n`;
    if (data.laureaCitta) description += `- Città: ${data.laureaCitta}\n`;
    if (data.laureaOrario) description += `- Orario seduta: ${data.laureaOrario}\n`;
  }
  
  // Aggiungi soluzione e extra
  if (data.soluzione) description += `\n📸 Soluzione selezionata: ${data.soluzione}\n`;
  if (data.extra?.length > 0) description += `➕ Extra: ${data.extra.join(', ')}\n`;
  
  // Dettagli aggiuntivi
  if (data.polaroid) description += `\nPolaroid: ${data.polaroid ? 'Sì' : 'No'}\n`;
  if (data.cartoncino) description += `Cartoncini: ${data.cartoncino}\n`;
  
  if (data.indirizzo) description += `\n📍 Indirizzo evento:\n${data.indirizzo}\n`;
  if (data.note) description += `\n📝 Note cliente:\n${data.note}\n`;
  
  return {
    summary: `${data.tipoEvento}: ${data.nome} ${data.cognome}`,
    description: description.trim(),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Europe/Rome'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Europe/Rome'
    },
    attendees: data.email ? [{ email: data.email, displayName: `${data.nome} ${data.cognome}` }] : [],
    reminders: {
      useDefault: true
    }
  };
}