import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, cognome, telefono, tipoEvento, dataEvento, luogo, soluzione, note } = body

    // Validazione campi obbligatori
    if (!nome || !cognome || !telefono || !tipoEvento || !dataEvento || !luogo || !soluzione) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    // Setup OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback'
    )

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Data evento
    const eventDate = new Date(dataEvento)
    const endDate = new Date(dataEvento)
    endDate.setHours(endDate.getHours() + 1)

    // Descrizione dettagliata per l'attività
    const description = `
📋 RICHIESTA DI PRENOTAZIONE

👤 Cliente: ${nome} ${cognome}
📱 Telefono/WhatsApp: ${telefono}
🎉 Tipo evento: ${tipoEvento}
📍 Luogo: ${luogo}
📦 Soluzione scelta: ${soluzione}
${note ? `📝 Note: ${note}` : ''}

---
Prenotazione ricevuta tramite il form online.
    `.trim()

    // Crea l'evento su Google Calendar
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `📸 ${tipoEvento} — ${nome} ${cognome}`,
        description,
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: 'Europe/Rome',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Europe/Rome',
        },
        colorId: '2', // Verde salvia
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 * 24 * 7 }, // 1 settimana prima
            { method: 'popup', minutes: 60 * 24 },     // 1 giorno prima
          ],
        },
      },
    })

    // Genera messaggio WhatsApp recap
    const dataFormattata = new Date(dataEvento).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const messaggioWhatsApp = `Ciao ${nome}! Ho ricevuto la tua richiesta di prenotazione 📸

*Ecco il riepilogo:*
• Evento: ${tipoEvento}
• Data: ${dataFormattata}
• Luogo: ${luogo}
• Soluzione: ${soluzione}
${note ? `• Note: ${note}` : ''}

Ti contatterò a breve per confermare tutti i dettagli. A presto! 🎉`

    const whatsappUrl = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(messaggioWhatsApp)}`

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      whatsappUrl,
      messaggio: messaggioWhatsApp,
    })

  } catch (error) {
    console.error('Errore Calendar:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione dell\'evento', details: error.message },
      { status: 500 }
    )
  }
}
