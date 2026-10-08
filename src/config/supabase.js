// Dove finiscono le prenotazioni.
//
// Stessa base dei preventivi (progetto photogallery): le visite alle pagine e
// le prenotazioni che ne derivano stanno nello stesso posto.
//
// La chiave NON sta qui dentro. Le pagine dei preventivi usano la chiave
// publishable, che e' scritta nel loro HTML e quindi la puo' leggere chiunque:
// per le statistiche va bene, per l'archivio dei clienti no. Qui serve la
// chiave segreta, che vive solo fra le variabili d'ambiente di Vercel.
//
// Senza di lei il form continua a funzionare — calendario e mail partono
// comunque — ma le prenotazioni non vengono archiviate e nei log resta scritto
// perche'.
//
//   SUPABASE_SECRET_KEY   chiave segreta (Supabase > Project Settings > API keys)
//   SUPABASE_URL          facoltativa: senza, vale quella qui sotto
//
// L'indirizzo del progetto non e' un segreto: e' gia' pubblico nelle pagine.

export const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://itxpyptobqjkbatqeolh.supabase.co';

export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';

export const TABELLA_PRENOTAZIONI = 'prenotazioni';

export const chiaveMancante = () => !SUPABASE_SECRET_KEY;
