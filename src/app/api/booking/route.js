import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, cognome, telefono, tipoEvento, chiesa, dataEvento, luogo, soluzione, extra, indirizzo, note } = body

    if (!nome || !cognome || !telefono || !tipoEvento || !dataEvento || !luogo || !soluzione) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    // ── GOOGLE CALENDAR ────────────────────────────────────────────────────
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback'
    )
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const dataParts = dataEvento.split('-')
    const dataIntera = `${dataParts[0]}-${dataParts[1]}-${dataParts[2]}`

    const description = `
📋 RICHIESTA DI PRENOTAZIONE

👤 Cliente: ${nome} ${cognome}
📱 Telefono/WhatsApp: +39${telefono.replace(/\D/g, '')}
🎉 Tipo evento: ${tipoEvento}
📦 Soluzione scelta: ${soluzione}
${chiesa ? `⛪ Chiesa: ${chiesa}` : ''}
${indirizzo ? `🏠 Indirizzo casa: ${indirizzo}` : ''}
📍 Luogo evento: ${luogo}
${extra && extra.length > 0 ? `✨ Extra: ${extra.join(', ')}` : ''}
${note ? `📝 Note: ${note}` : ''}

---
Prenotazione ricevuta tramite il form online.
    `.trim()

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `📸 ${tipoEvento} — ${nome} ${cognome}`,
        description,
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

    // ── DATA FORMATTATA ────────────────────────────────────────────────────
    const dataFormattata = new Date(dataEvento + 'T12:00:00').toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // ── EMAIL NOTIFICA A RUGGIERO ──────────────────────────────────────────
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Booking Fotografo <onboarding@resend.dev>',
          to: process.env.NOTIFY_EMAIL,
          subject: `📸 Nuova prenotazione — ${tipoEvento} · ${nome} ${cognome}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1E1A16;">
              <h2 style="font-size:24px;font-weight:400;border-bottom:1px solid #DDD6CC;padding-bottom:16px;">
                📸 Nuova prenotazione ricevuta
              </h2>
              <table style="width:100%;border-collapse:collapse;margin-top:24px;">
                <tr><td style="padding:10px 0;color:#6B5F52;width:160px;">Cliente</td><td style="padding:10px 0;font-weight:600;">${nome} ${cognome}</td></tr>
                <tr style="background:#F7F3EE;"><td style="padding:10px 8px;color:#6B5F52;">Telefono</td><td style="padding:10px 8px;">+39${telefono.replace(/\D/g, '')}</td></tr>
                <tr><td style="padding:10px 0;color:#6B5F52;">Tipo evento</td><td style="padding:10px 0;">${tipoEvento}</td></tr>
                <tr style="background:#F7F3EE;"><td style="padding:10px 8px;color:#6B5F52;">Data</td><td style="padding:10px 8px;">${dataFormattata}</td></tr>
                <tr><td style="padding:10px 0;color:#6B5F52;">Soluzione</td><td style="padding:10px 0;">${soluzione}</td></tr>
                <tr style="background:#F7F3EE;"><td style="padding:10px 8px;color:#6B5F52;">Luogo</td><td style="padding:10px 8px;">${luogo}</td></tr>
                ${chiesa ? `<tr style="background:#F7F3EE;"><td style="padding:10px 8px;color:#6B5F52;">Chiesa</td><td style="padding:10px 8px;">${chiesa}</td></tr>` : ''}
                ${indirizzo ? `<tr><td style="padding:10px 0;color:#6B5F52;">Indirizzo casa</td><td style="padding:10px 0;">${indirizzo}</td></tr>` : ''}
                ${extra && extra.length > 0 ? `<tr style="background:#F7F3EE;"><td style="padding:10px 8px;color:#6B5F52;">Extra</td><td style="padding:10px 8px;">${extra.join(', ')}</td></tr>` : ''}
                ${note ? `<tr><td style="padding:10px 0;color:#6B5F52;">Note</td><td style="padding:10px 0;">${note}</td></tr>` : ''}
              </table>
              <p style="margin-top:32px;font-size:13px;color:#A99C84;">
                Evento aggiunto automaticamente su Google Calendar.
              </p>
            </div>
          `,
        }),
      })
    } catch (emailErr) {
      // L'email non blocca il flusso principale
      console.error('Errore invio email:', emailErr)
    }

    // ── WHATSAPP URL → MESSAGGIO A RUGGIERO ───────────────────────────────
    const messaggioWA = `Ciao Ruggiero! Ho appena compilato il form di prenotazione 📸\n\n*Ecco il riepilogo:*\n• Nome: ${nome} ${cognome}\n• Evento: ${tipoEvento}\n• Data: ${dataFormattata}\n• Luogo: ${luogo}\n• Soluzione: ${soluzione}\n${chiesa ? `• Chiesa: ${chiesa}\n` : ''}${indirizzo ? `• Indirizzo casa: ${indirizzo}\n` : ''}${extra && extra.length > 0 ? `• Extra: ${extra.join(', ')}\n` : ''}${note ? `• Note: ${note}\n` : ''}\nAttendo conferma, grazie!`

    const whatsappUrl = `https://wa.me/393299392486?text=${encodeURIComponent(messaggioWA)}`

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      whatsappUrl,
    })

  } catch (error) {
    console.error('Errore:', error)
    return NextResponse.json(
      { error: "Errore nella creazione dell'evento", details: error.message },
      { status: 500 }
    )
  }
}
