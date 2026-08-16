# Booking Fotografo — Ruggiero Dimiccoli

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Webapp di prenotazione servizi fotografici. Il form invia i dati a Google Calendar e genera un link WhatsApp con il riepilogo.

## ✨ Nuove feature (v0.2)

- **Configurazione prezzi centralizzata** - Modifica i prezzi in un unico file (`src/config/prices.js`)
- **Validazione input robusta** - Controlli su telefono, email e date
- **Logger integrato** - Log strutturati per debug e monitoraggio
- **Email di conferma cliente** - Notifica automatica all'utente
- **Prezzo calcolato in tempo reale** - Visualizzazione del totale durante la compilazione
- **Gestione errori migliorata** - Feedback chiaro e logging degli errori

## 📋 Requisiti

- Node.js 18+
- Account Google Cloud con Calendar API abilitata
- Account Resend per le email (opzionale)

## 🛠️ Setup locale

```bash
# Clona il repository
git clone https://github.com/tuo-utente/booking-fotografo.git
cd booking-fotografo

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env.local

# Modifica .env.local con le tue credenziali
nano .env.local  # o il tuo editor preferito
```

### Configurazione Google Calendar

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto
3. Abilita **Calendar API**
4. Configura OAuth consent screen
5. Crea credenziali OAuth 2.0
6. Esegui lo script di autenticazione per ottenere il refresh token

### Configurazione Resend (opzionale)

1. Vai su [Resend](https://resend.com/)
2. Crea un account e ottieni la tua API key
3. Aggiungi `RESEND_API_KEY` nel file `.env.local`

## 🚀 Avvio sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📦 Build per produzione

```bash
npm run build
npm start
```

## 🗂️ Struttura del progetto

```
booking-fotografo/
├── src/
│   ├── app/              # App Router di Next.js
│   │   ├── api/         # API routes
│   │   │   └── booking/ # Endpoint per la gestione delle prenotazioni
│   │   └── page.js      # Pagina principale del form
│   ├── config/
│   │   └── prices.js    # Configurazione prezzi centralizzata
│   └── lib/
│       ├── google-calendar.js  # Gestione Google Calendar API
│       ├── email.js           # Invio email con Resend
│       ├── validation.js      # Validazione input
│       ├── whatsapp.js        # Generazione link WhatsApp
│       └── logger.js          # Logger integrato
├── public/              # Asset statici
├── .env.local          # Variabili d'ambiente (NON versionare!)
├── .env.example        # Template per le variabili
└── next.config.js      # Configurazione Next.js
```

## 🔧 Variabili d'ambiente

```env
# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=...

# Resend (email)
RESEND_API_KEY=re_...
NOTIFY_EMAIL=il_tuo_email@esempio.com

# Altro
NODE_ENV=development
```

## 📝 Modificare i prezzi

Modifica il file [`src/config/prices.js`](src/config/prices.js):

```javascript
export const SOLUTIONS = {
  'Primo Compleanno': [
    { id: 'pc-1', label: 'Soluzione 1 — Reportage completo', price: 230 },
    // ...
  ],
};

export const EXTRAS = {
  'Primo Compleanno': [
    { id: 'pc-book', label: 'Fotolibro aggiuntivo', price: 150, type: 'book' },
    // ...
  ],
};
```

## 🤝 Contribuire

1. Forka il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 License

Distribuito sotto licenza MIT. Vedi [LICENSE](LICENSE) per maggiori informazioni.

---

Made with ❤️ by [Ruggiero Dimiccoli](https://github.com/ruggiero)