// Dove finiscono le prenotazioni.
//
// Stessa base dei preventivi (progetto photogallery): cosi' le visite alle
// pagine e le prenotazioni che ne derivano stanno nello stesso posto.
//
// La chiave e' la publishable, la stessa gia' pubblicata nell'HTML delle sei
// pagine dei preventivi: non e' un segreto e non aggiunge esposizione. La
// tabella accetta solo INSERT (vedi sql/prenotazioni.sql), quindi con questa
// chiave si puo' scrivere ma non leggere: per rileggere serve la service key,
// che resta fuori dal codice.
//
// Le variabili d'ambiente, se presenti, hanno la precedenza.

export const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://itxpyptobqjkbatqeolh.supabase.co';

export const SUPABASE_KEY =
  process.env.SUPABASE_KEY || 'sb_publishable_3ZEoWYD_QcA_SOMm2IbJww_l_HgbmYa';

export const TABELLA_PRENOTAZIONI = 'prenotazioni';
