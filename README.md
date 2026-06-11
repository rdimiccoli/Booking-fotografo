# Booking Fotografo — Ruggiero Dimiccoli

Webapp di prenotazione servizi fotografici. Il form invia i dati a Google Calendar e genera un link WhatsApp con il riepilogo.

## Setup locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Variabili d'ambiente

Nel file `.env.local` (già configurato):

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=...
```

## Deploy su Vercel

1. Crea un repo GitHub e carica il progetto (**senza** `.env.local` — è nel `.gitignore`)
2. Vai su [vercel.com](https://vercel.com) → **New Project** → importa il repo
3. Nella sezione **Environment Variables** aggiungi le 4 variabili del `.env.local`
4. Clicca **Deploy**

Il link pubblico sarà tipo `https://booking-fotografo.vercel.app`.

## Aggiungere nuovi tipi di evento

In `src/app/page.js`, nel dizionario `SOLUZIONI`, aggiungi il tipo evento e le sue soluzioni:

```js
'Comunione': [
  'Soluzione 1 — Solo cerimonia (€X)',
  'Soluzione 2 — Cerimonia + pranzo (€Y)',
],
```
