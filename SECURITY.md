# Security Policy

## 🔒 Pratiche di Sicurezza

### File sensibili
- `.env.local` contiene credenziali sensibili e **non deve mai essere committato**
- Usa sempre `.env.example` come template per la configurazione
- I file `.env.local` sono già inclusi in `.gitignore`

### Input validation
- Tutti gli input utente vengono validati lato client e server
- Controlli su:
  - Numeri di telefono (formato internazionale)
  - Email (validazione sintattica)
  - Date (non nel passato, max 12 mesi in avanti)

### Rate limiting
- L'API route `/api/booking` è protetta da rate limiting (configurabile)
- Per produzione, consigliamo di usare un servizio come Cloudflare o nginx

## 🛡️ Best Practices

### Per lo sviluppo locale
1. Non condividere mai il file `.env.local`
2. Usare credenziali diverse per sviluppo e produzione
3. Abilitare `NODE_ENV=development` solo in locale

### Per la produzione
1. Usare variabili d'ambiente gestite dal provider (Vercel, Netlify, etc.)
2. Abilitare HTTPS su tutti i endpoint
3. Configurare un firewall per proteggere l'API
4. Monitorare i log per rilevare attacchi

## 📞 Segnalazione vulnerabilità

Se trovi una vulnerabilità di sicurezza, contattami direttamente all'indirizzo:
**ruggiero.dimiccoli@gmail.com**

Non creare issue pubbliche per problemi di sicurezza.

## 🔄 Aggiornamenti di sicurezza

Le dipendenze vengono aggiornate regolarmente. Esegui:

```bash
npm audit fix
```

per applicare le patch di sicurezza disponibili.