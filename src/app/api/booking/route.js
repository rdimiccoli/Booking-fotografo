import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, cognome, telefono, tipoEvento, dataEvento, luogo, soluzione, note } = body

    if (!nome || !cognome || !telefono || !tipoEvento || !dataEvento || !luogo || !soluzione) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback'
    )

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Crea evento come giornata intera (no orario specifico)
    const dataParts = dataEvento.split('-') // YYYY-MM-DD
    const dataIntera = `${dataParts[0]}-${dataParts[1]}-${dataParts[2]}`

    const description = `
📋 RICHIESTA DI PRENOTAZIONE

👤 Cliente: ${nome} ${cognome}
📱 Telefono/WhatsApp: +39${telefono.replace(/\D/g, '')}
🎉 Tipo evento: ${tipoEvento}
📦 Soluzione scelta: ${soluzione}
📍 Luogo: ${luogo}
${note ? `📝 Note: ${note}` : ''}

---
Prenotazione ricevuta tramite il form online.
    `.trim()

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `📸 ${tipoEvento} — ${nome} ${cognome}`,
        description,
        // Evento a giornata intera — nessun orario, nessun fuso orario
        start: { date: dataIntera },
        end:   { date: dataIntera },
        colorId: '2',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 * 24 * 7 },
            { method: 'popup', minutes: 60 * 24 },
          ],
        },
      },
    })

    const dataFormattata = new Date(dataEvento + 'T12:00:00').toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const messaggioWhatsApp = `Ciao ${nome}! Ho ricevuto la tua richiesta di prenotazione 📸\n\n*Ecco il riepilogo:*\n• Evento: ${tipoEvento}\n• Data: ${dataFormattata}\n• Luogo: ${luogo}\n• Soluzione: ${soluzione}\n${note ? `• Note: ${note}` : ''}\n\nTi contatterò a breve per confermare tutti i dettagli. A presto! 🎉`

    // Numero sempre italiano: aggiungo 39 se non già presente
    const numeroPulito = telefono.replace(/\D/g, '')
    const numeroWA = numeroPulito.startsWith('39') ? numeroPulito : `39${numeroPulito}`
    const whatsappUrl = `https://wa.me/${numeroWA}?text=${encodeURIComponent(messaggioWhatsApp)}`

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      whatsappUrl,
      messaggio: messaggioWhatsApp,
    })

  } catch (error) {
    console.error('Errore Calendar:', error)
    return NextResponse.json(
      { error: "Errore nella creazione dell'evento", details: error.message },
      { status: 500 }
    )
  }
}
