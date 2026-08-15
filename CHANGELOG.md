# Changelog

Tutti i cambiamenti importanti in questo progetto sono documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [0.2.0] - 2026-08-13

### Aggiunto
- Configurazione prezzi centralizzata in `src/config/prices.js`
- Validazione input robusta con controlli su telefono, email e date
- Logger integrato in `src/lib/logger.js`
- Email di conferma automatica per il cliente
- Calcolo prezzo totale in tempo reale nel form
- Gestione errori migliorata con feedback chiaro
- Endpoint health check `/api/booking` (GET)
- Documentazione completa in README.md

### Migliorato
- Architettura del codice più modulare e manutenibile
- Separazione delle responsabilità (config, validation, API)
- UX con messaggi di errore più chiari
- Prezzi visualizzati durante la compilazione

## [0.1.0] - Prima versione

### Aggiunto
- Form di prenotazione completo
- Integrazione Google Calendar
- Generazione link WhatsApp
- Notifica email tramite Resend