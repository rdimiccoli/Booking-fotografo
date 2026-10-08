import { NextResponse } from 'next/server'
import { createCalendarEvent, verifyCalendarConnection } from '@/lib/google-calendar'
import { sendNotificationEmail } from '@/lib/email'
import { archiviaPrenotazione } from '@/lib/archivio'
import { info, warn, logError, debug, logObject, logFullError } from '@/lib/logger'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, cognome, tipoEvento } = body

    // Tutti i campi del form, senza riscriverli uno per uno: quando il form
    // guadagna un campo nuovo arriva da solo al calendario e alla mail.
    const prenotazione = {
      ...body,
      telefono: String(body.telefono || ''),
      extra: Array.isArray(body.extra) ? body.extra : [],
      laureaTipi: Array.isArray(body.laureaTipi) ? body.laureaTipi : [],
    }

    info(`Nuova richiesta di prenotazione da ${nome} ${cognome}`)

    // Validazione campi obbligatori
    // Per la sola seduta di laurea il luogo non serve: si svolge in facolta'
    const obbligatori = ['nome', 'cognome', 'telefono', 'tipoEvento', 'dataEvento']
    if (tipoEvento !== 'Laurea — Seduta') obbligatori.push('luogo')

    const mancanti = obbligatori.filter(campo => !body[campo])
    if (mancanti.length) {
      warn('Richiesta mancante di campi obbligatori', { missing: mancanti })
      return NextResponse.json({
        error: 'Campi obbligatori mancanti',
        missingFields: mancanti
      }, { status: 400 })
    }

    // Verifica connessione Google Calendar (non bloccante)
    const calendarCheck = await verifyCalendarConnection()
    if (!calendarCheck.success) {
      logError('Errore Google Calendar:', calendarCheck.message)
      warn('Il form verrà comunque elaborato ma non verranno creati eventi su Google Calendar')
    }

    // Crea evento su Google Calendar (con retry automatico, non bloccante)
    let eventDetails = null
    try {
      eventDetails = await createCalendarEvent(prenotazione)
      info('Evento creato su Google Calendar', { eventId: eventDetails.eventId })
    } catch (calendarError) {
      logFullError(calendarError, { context: 'POST /api/booking - createCalendarEvent' })
      warn('Errore creazione evento Google Calendar (non bloccante):', calendarError.message)
    }

    // Invia email notifica (con retry, non bloccante)
    try {
      await sendNotificationEmail(prenotazione, eventDetails)
      info('Email di notifica inviata')
    } catch (emailError) {
      logFullError(emailError, { context: 'POST /api/booking - sendNotificationEmail' })
      warn('Errore invio email (non bloccante):', emailError.message)
    }

    // Copia consultabile della prenotazione: calendario e mail da soli non
    // bastano, se la mail non arriva il dato e' perso.
    let archiviata = false
    try {
      const esito = await archiviaPrenotazione(prenotazione, eventDetails?.eventId || null)
      archiviata = esito.success
      if (!esito.success) warn('Prenotazione non archiviata (non bloccante):', esito.message)
    } catch (archivioError) {
      logFullError(archivioError, { context: 'POST /api/booking - archiviaPrenotazione' })
    }

    return NextResponse.json({ 
      success: true,
      eventId: eventDetails?.eventId || null,
      message: 'Richiesta elaborata con successo',
      googleCalendarConnected: calendarCheck.success,
      archiviata
    })
    
  } catch (err) {
    logFullError(err, { context: 'POST /api/booking - main' })
    return NextResponse.json({ 
      error: 'Errore interno del server',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 })
  }
}

export async function GET() {
  // Endpoint di health check per Google Calendar
  const calendarCheck = await verifyCalendarConnection()
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    googleCalendar: {
      connected: calendarCheck.success,
      message: calendarCheck.message
    }
  })
}