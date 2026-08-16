// Gestione Resend API per email

import { info, warn, logError, debug } from '@/lib/logger';
import { getSolutionLabel, getExtraLabel } from '@/config/prices';

const MAX_EMAIL_RETRIES = 2;
const EMAIL_RETRY_DELAY_MS = 500;

export async function sendNotificationEmail(formData, eventDetails = null) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || 'ruggiero.dimiccoli@gmail.com';
  
  if (!resendApiKey) {
    warn('RESEND_API_KEY non configurata. Email di notifica non inviata.');
    return { success: true, message: 'Resend non configurato' };
  }
  
  const laureaInfo = formData.tipoEvento === 'Laurea' && formData.laureaTipi?.length > 0
    ? `
      <div class="laurea-section">
        <p><strong>Tipo laurea:</strong> ${formData.laureaTipi.join(' + ')}</p>
        ${formData.laureaFacolta ? `<p><strong>Facoltà:</strong> ${formData.laureaFacolta}</p>` : ''}
        ${formData.laureaCitta ? `<p><strong>Città sede:</strong> ${formData.laureaCitta}</p>` : ''}
        ${formData.laureaOrario ? `<p><strong>Orario seduta:</strong> ${formData.laureaOrario}</p>` : ''}
      </div>
    `.trim()
    : '';
  
  // Formatta data evento
  const formattedDate = formData.dataEvento 
    ? new Date(formData.dataEvento + 'T12:00:00').toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';
  
  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuova prenotazione - Booking Fotografo</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF6F2;font-family:'Georgia',serif;color:#1E1A16;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <div class="email-container" style="max-width:560px;background:#FFFFFF;border-radius:8px;box-shadow:0 4px 12px rgba(30,26,22,0.08);overflow:hidden;">
          <!-- Header -->
          <div style="background:#F7F3EE;padding:24px 32px;text-align:center;">
            <h2 style="margin:0;font-size:24px;font-weight:400;color:#6B5F52;">📸 Nuova prenotazione ricevuta</h2>
          </div>
          
          <!-- Main Content -->
          <div style="padding:32px 24px;">
            <!-- Cliente Info -->
            <div class="info-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Cliente</p>
                <p style="margin:0;font-weight:600;">${formData.nome} ${formData.cognome}</p>
              </div>
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Telefono</p>
                <p style="margin:0;">+39${formData.telefono.replace(/\D/g, '')}</p>
              </div>
              ${formData.email ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Email</p>
                <p style="margin:0;">${formData.email}</p>
              </div>` : ''}
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Tipo evento</p>
                <p style="margin:0;">${formData.tipoEvento}</p>
              </div>
            </div>
            
            ${laureaInfo ? `
            <!-- Laurea Info -->
            <div style="background:#F7F3EE;padding:16px;border-radius:6px;margin-bottom:24px;">
              ${laureaInfo}
            </div>` : ''}
            
            <!-- Event Details -->
            <div class="info-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
              ${formData.nomeFesteggiato ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Festeggiato</p>
                <p style="margin:0;font-weight:600;">${formData.nomeFesteggiato}</p>
              </div>` : ''}
              ${formData.descrizioneAltro ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;grid-column:1/-1;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Di che evento si tratta</p>
                <p style="margin:0;">${formData.descrizioneAltro}</p>
              </div>` : ''}
              ${formData.provenienza ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Arriva da</p>
                <p style="margin:0;">${formData.provenienza}</p>
              </div>` : ''}
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Data evento</p>
                <p style="margin:0;">${formattedDate}</p>
              </div>
              ${formData.oraEvento ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Orario evento</p>
                <p style="margin:0;">${formData.oraEvento}</p>
              </div>` : ''}
              ${formData.soluzione ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Soluzione</p>
                <p style="margin:0;">${getSolutionLabel(formData.soluzione)}</p>
              </div>` : ''}
              ${formData.chiesa ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Chiesa</p>
                <p style="margin:0;">${formData.chiesa}</p>
              </div>` : ''}
            </div>
            
            <!-- Location Info -->
            <div class="info-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
              <div style="background:#F7F3EE;padding:12px;border-radius:6px;" colspan="2">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Luogo evento</p>
                <p style="margin:0;">${formData.luogo}</p>
              </div>
              ${formData.indirizzo ? `
              <div style="background:#F7F3EE;padding:12px;border-radius:6px;" colspan="2">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Indirizzo casa</p>
                <p style="margin:0;">${formData.indirizzo}</p>
              </div>` : ''}
            </div>
            
            <!-- Extras -->
            ${(formData.extra && formData.extra.length > 0) || formData.polaroid || formData.cartoncino ? `
            <div class="info-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
              ${formData.extra && formData.extra.length > 0 ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Extra</p>
                <p style="margin:0;">${formData.extra.map(getExtraLabel).join(', ')}</p>
              </div>` : ''}
              ${formData.polaroid ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Polaroid</p>
                <p style="margin:0;">${getExtraLabel(formData.polaroid)}</p>
              </div>` : ''}
              ${formData.cartoncino ? `
              <div style="background:#FAF6F2;padding:12px;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8C7560;">Cartoncino</p>
                <p style="margin:0;">${getExtraLabel(formData.cartoncino)} ${formData.quantitaCartoncini > 1 ? `(${formData.quantitaCartoncini} pezzi)` : ''}</p>
              </div>` : ''}
            </div>` : ''}
            
            <!-- Notes -->
            ${formData.note ? `
            <div style="background:#F7F3EE;padding:16px;border-radius:6px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:13px;color:#8C7560;">Note:</p>
              <p style="margin:0;line-height:1.6;">${formData.note}</p>
            </div>` : ''}
          </div>
          
          <!-- Footer -->
          <div style="background:#F7F3EE;padding:24px 32px;text-align:center;border-top:1px solid #DDD6CC;">
            ${eventDetails && eventDetails.eventUrl ? `
            <p style="margin:0 0 8px;font-size:13px;color:#6B5F52;">
              📅 Evento creato su Google Calendar:
              <a href="${eventDetails.eventUrl}" target="_blank" style="color:#6B5F52;text-decoration:underline;">Apri evento</a>
            </p>` : ''}
            <p style="margin:0;font-size:12px;color:#8C7560;line-height:1.5;">
              Prenotazione ricevuta tramite il form online.<br>
              Richiesta inviata alle ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} del ${new Date().toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
        
        <!-- Responsive Styles -->
        <style>
          @media (max-width: 600px) {
            .email-container { border-radius: 0; }
            .info-grid { grid-template-columns: 1fr !important; }
          }
        </style>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  
  // Retry loop per gestire errori temporanei
  for (let attempt = 0; attempt <= MAX_EMAIL_RETRIES; attempt++) {
    try {
      debug(`Tentativo invio email (${attempt + 1}/${MAX_EMAIL_RETRIES + 1})`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Booking Fotografo <onboarding@resend.dev>',
          to: notifyEmail,
          subject: `📸 Nuova prenotazione — ${formData.tipoEvento} · ${formData.nome} ${formData.cognome}`,
          html,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nell\'invio dell\'email');
      }
      
      const result = await response.json();
      info('Email inviata con successo', { messageId: result.id });
      return { success: true, messageId: result.id };
      
    } catch (error) {
      if (attempt < MAX_EMAIL_RETRIES) {
        debug(`Riprovo invio email tra ${EMAIL_RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, EMAIL_RETRY_DELAY_MS));
      } else {
        logError('Errore invio email dopo tutti i tentativi:', error.message);
        throw new Error(`Errore nell'invio della notifica email: ${error.message}`);
      }
    }
  }
}