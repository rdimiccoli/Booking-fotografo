// Gestione link WhatsApp

import { getSolutionLabel, getExtraLabel } from '@/config/prices';

export function generateWhatsAppUrl(formData) {
  const phoneNumber = formData.telefono.replace(/\D/g, '');
  
  // Normalizza numero: aggiungi +39 se manca
  let cleanPhone = phoneNumber;
  if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('39')) {
    cleanPhone = `+39${cleanPhone}`;
  } else if (cleanPhone.startsWith('39') && !cleanPhone.startsWith('+39')) {
    cleanPhone = `+${cleanPhone}`;
  }
  
  const laureaInfo = formData.tipoEvento === 'Laurea' && formData.laureaTipi?.length > 0
    ? `\n🎓 Tipo laurea: ${formData.laureaTipi.join(' + ')}${formData.laureaFacolta ? `\n📚 Facoltà: ${formData.laureaFacolta}` : ''}${formData.laureaCitta ? `\n🏛️ Città sede: ${formData.laureaCitta}` : ''}${formData.laureaOrario ? `\n⏰ Orario seduta: ${formData.laureaOrario}` : ''}`
    : '';
  
  const message = `
*📋 RICHIESTA DI PRENOTAZIONE*

👤 *Cliente:* ${formData.nome} ${formData.cognome}
📱 *Telefono:* ${cleanPhone}
🎉 *Tipo evento:* ${formData.tipoEvento}${laureaInfo}
${formData.nomeFesteggiato ? `🎂 *Festeggiato:* ${formData.nomeFesteggiato}` : ''}

${formData.soluzione ? `📦 *Soluzione scelta:* ${getSolutionLabel(formData.soluzione)}` : ''}
${formData.chiesa ? `⛪ *Chiesa:* ${formData.chiesa}` : ''}
${formData.indirizzo ? `🏠 *Indirizzo casa:* ${formData.indirizzo}` : ''}
📍 *Luogo evento:* ${formData.luogo}

${formData.oraEvento ? `⏰ *Orario evento:* ${formData.oraEvento}` : ''}

${formData.dataEvento ? `📅 *Data evento:* ${new Date(formData.dataEvento + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : ''}

${formData.extra && formData.extra.length > 0 ? `✨ *Extra:* ${formData.extra.map(getExtraLabel).join(', ')}` : ''}
${formData.polaroid ? `📷 *Polaroid:* ${getExtraLabel(formData.polaroid)}` : ''}
${formData.cartoncino ? `🖼️ *Cartoncino:* ${getExtraLabel(formData.cartoncino)}` : ''}

${formData.note ? `\n📝 *Note:* ${formData.note}` : ''}
${formData.provenienza ? `🔗 *Arriva da:* ${formData.provenienza}` : ''}

---
*Richiesta inviata tramite il form online.*
  `.trim();
  
  // Codifica URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone.replace('+', '')}?app_absent=0&text=${encodedMessage}`;
}

export function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  let cleaned = phone.replace(/\D/g, '');
  
  // Formatta come +39 XXX XXXXXXX (spazi ogni 3 cifre dopo il prefisso)
  if (cleaned.length >= 12 && !cleaned.startsWith('+')) {
    cleaned = `+39 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    cleaned = `+39 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return cleaned;
}