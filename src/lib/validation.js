// Validazione form e input

export function validateName(name, fieldName = 'Nome') {
  if (!name?.trim()) {
    return { valid: false, error: `${fieldName} è obbligatorio` };
  }
  
  // Rimuove spazi extra
  const cleaned = name.trim();
  
  // Lunghezza minima/massima (2-50 caratteri)
  if (cleaned.length < 2 || cleaned.length > 50) {
    return { valid: false, error: `${fieldName} deve essere tra i 2 e i 50 caratteri` };
  }
  
  // Solo lettere, spazi e apostrofi (per nomi come "D'Angelo" o "Macron")
  const nameRegex = /^[a-zA-ZÀ-ÿ\s']+$/;
  if (!nameRegex.test(cleaned)) {
    return { valid: false, error: `${fieldName} contiene caratteri non validi (usa solo lettere e spazi)` };
  }
  
  return { valid: true, cleaned };
}

export function validatePhoneNumber(phone) {
  if (!phone) return { valid: false, error: 'Il numero di telefono è obbligatorio' };
  
  // Rimuovi tutti i caratteri non numerici
  const cleaned = phone.replace(/\D/g, '');
  
  // Controllo lunghezza (numeri italiani)
  if (cleaned.length < 9 || cleaned.length > 13) {
    return { valid: false, error: 'Numero di telefono non valido' };
  }
  
  // Deve iniziare con +39 o 3
  if (!cleaned.startsWith('3') && !phone.startsWith('+39')) {
    return { valid: false, error: 'Il numero deve iniziare con +39 o 3' };
  }
  
  return { valid: true, cleaned };
}

export function validateEmail(email) {
  if (!email || email.trim() === '') return { valid: true }; // Non obbligatorio
  
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Formato email non valido' };
  }
  
  // Controllo lunghezza massima RFC (254 caratteri)
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email troppo lunga' };
  }
  
  return { valid: true, cleaned: trimmed };
}

export function validateDate(date) {
  if (!date) return { valid: false, error: 'La data è obbligatoria' };
  
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate < today) {
    return { valid: false, error: 'La data non può essere nel passato' };
  }
  
  // Non più di 12 mesi in avanti
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  
  if (inputDate > maxDate) {
    return { valid: false, error: 'La data non può essere più di 12 mesi nel futuro' };
  }
  
  return { valid: true };
}

export function validateForm(formData) {
  const errors = {};
  
  // Nome
  const nomeValidation = validateName(formData.nome?.trim(), 'Nome');
  if (!nomeValidation.valid) {
    errors.nome = nomeValidation.error;
  }
  
  // Cognome
  const cognomeValidation = validateName(formData.cognome?.trim(), 'Cognome');
  if (!cognomeValidation.valid) {
    errors.cognome = cognomeValidation.error;
  }
  
  // Telefono (già validato separatamente, ma controllo di coerenza)
  if (!formData.telefono?.trim()) {
    errors.telefono = 'Il numero di telefono è obbligatorio';
  }
  
  // Email opzionale ma valida se presente
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }
  
  // Tipo evento
  if (!formData.tipoEvento?.trim()) {
    errors.tipoEvento = 'Seleziona un tipo di evento';
  }

  // Nome del festeggiato: obbligatorio tranne che per le richieste generiche
  if (formData.tipoEvento && formData.tipoEvento !== 'Altro') {
    const festeggiato = formData.nomeFesteggiato?.trim();
    if (!festeggiato) {
      errors.nomeFesteggiato = 'Indica il nome di chi festeggia';
    } else if (festeggiato.length > 80) {
      errors.nomeFesteggiato = 'Il nome del festeggiato è troppo lungo';
    }
  }
  
  // Numero invitati: facoltativo, ma se c'e' dev'essere plausibile
  if (formData.numeroInvitati !== '' && formData.numeroInvitati != null) {
    const invitati = Number(formData.numeroInvitati);
    if (!Number.isInteger(invitati) || invitati < 1 || invitati > 2000) {
      errors.numeroInvitati = 'Indica un numero di invitati tra 1 e 2000';
    }
  }

  // Evento fuori listino: serve la descrizione
  if (formData.tipoEvento === 'Altro' && !formData.descrizioneAltro?.trim()) {
    errors.descrizioneAltro = 'Descrivi di che evento si tratta';
  }

  // Data evento
  const dateValidation = validateDate(formData.dataEvento);
  if (!dateValidation.valid) {
    errors.dataEvento = dateValidation.error;
  }
  
  // Luogo evento — non richiesto per la sola seduta di laurea, che si svolge
  // in facolta': la sede si ricava da facolta' e citta'
  if (formData.tipoEvento !== 'Laurea — Seduta' && !formData.luogo?.trim()) {
    errors.luogo = 'Il luogo dell\'evento è obbligatorio';
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
}