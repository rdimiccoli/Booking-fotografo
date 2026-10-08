// Configurazione prezzi del sistema prenotazioni.
//
// ATTENZIONE: file generato. Non modificarlo a mano.
// I prezzi arrivano dai preventivi (Documents/preventivi/_sorgente/dati/*.json):
// cambia li' e rilancia  node genera-listino.mjs
// Cosi' il prezzo che il cliente legge nel preventivo e quello che trova qui
// restano sempre gli stessi.
//
// Generato il 01/10/2026

export const SOLUTIONS = {
  'Primo Compleanno': [
    { id: 'pc-1', label: 'Soluzione 1 — Reportage completo', price: 240,
      desc: 'Servizio fotografico dell’intera festa' },
    { id: 'pc-2', label: 'Soluzione 2 — Sessione a casa', price: 210,
      desc: 'Servizio fotografico a casa prima della festa' },
    { id: 'pc-3', label: 'Soluzione 3 — Solo momento torta', price: 170,
      desc: 'Servizio fotografico del solo momento torta' },
  ],
  'Battesimo': [
    { id: 'bat-1', label: 'Soluzione 1 — Solo celebrazione', price: 100,
      desc: 'Servizio fotografico in chiesa' },
    { id: 'bat-2', label: 'Soluzione 2 — Messa e ristorante', price: 240,
      desc: 'Servizio fotografico in chiesa ed al ristorante' },
    { id: 'bat-3', label: 'Soluzione 3 — Giornata completa', price: 350,
      desc: "Servizio fotografico dell'intera giornata" },
  ],
  'Comunione': [
    { id: 'comm-1', label: 'Soluzione 1 — Celebrazione + ritratti', price: 200,
      desc: 'Servizio fotografico in chiesa e ritratti dopo la celebrazione' },
    { id: 'comm-2', label: 'Soluzione 2 — Giornata completa', price: 320,
      desc: "Servizio fotografico dell'intera giornata, dalla vestizione al ristorante" },
  ],
  'Cresima': [
    { id: 'cres-1', label: 'Soluzione 1 — Celebrazione + ritratti', price: 220,
      desc: 'Servizio fotografico in chiesa e ritratti dopo la celebrazione' },
    { id: 'cres-2', label: 'Soluzione 2 — Giornata completa', price: 350,
      desc: "Servizio fotografico dell'intera giornata, dalla vestizione al ristorante" },
  ],
  '18° Compleanno': [
    { id: '18-1', label: 'Soluzione 1 — Reportage completo', price: 250,
      desc: 'Servizio fotografico della festa' },
    { id: '18-2', label: 'Soluzione 2 — Shooting + festa', price: 380,
      desc: 'Shooting fotografico pre o post festa' },
    { id: '18-3', label: 'Soluzione 3 — Fino al primo ballo', price: 190,
      desc: "Servizio fotografico dall'inizio della festa alla prima pausa ballo" },
    { id: '18-4', label: 'Soluzione 4 — Essenziale', price: 90,
      desc: 'Servizio fotografico del solo momento torta' },
  ],
  'Laurea — Seduta': [
    { id: 'laurea-seduta-1', label: 'Soluzione 1 — La seduta in facoltà', price: 150,
      desc: 'Servizio fotografico della seduta presso la facoltà' },
  ],
  'Laurea — Festa': [
    { id: 'laurea-festa-1', label: 'Soluzione 1 — Reportage completo', price: 250,
      desc: 'Servizio fotografico della festa' },
    { id: 'laurea-festa-2', label: 'Soluzione 2 — Fino al primo ballo', price: 180,
      desc: "Servizio fotografico dall'inizio della festa al primo ballo" },
    { id: 'laurea-festa-3', label: 'Soluzione 3 — Essenziale', price: 80,
      desc: 'Servizio fotografico del solo momento torta' },
  ],
  '25° Anniversario di Matrimonio': [
    { id: 'ann25-1', label: 'Soluzione 1 — Solo celebrazione', price: 120,
      desc: 'Servizio fotografico durante la celebrazione della messa' },
    { id: 'ann25-2', label: 'Soluzione 2 — Messa e ristorante', price: 280,
      desc: 'Servizio fotografico della messa e scatti al ristorante' },
    { id: 'ann25-3', label: 'Soluzione 3 — Giornata completa', price: 360,
      desc: 'Servizio fotografico a casa, durante la messa e scatti al ristorante' },
  ],
  '50° Anniversario di Matrimonio': [
    { id: 'ann50-1', label: 'Soluzione 1 — Solo celebrazione', price: 100,
      desc: 'Servizio fotografico durante la celebrazione della messa' },
    { id: 'ann50-2', label: 'Soluzione 2 — Messa e momento torta', price: 220,
      desc: 'Servizio fotografico della messa e scatti al ristorante' },
    { id: 'ann50-3', label: 'Soluzione 3 — Giornata completa', price: 360,
      desc: 'Servizio fotografico a casa, durante la messa e al ristorante' },
  ],
  'Altro': [
    { id: 'altro-1', label: 'Soluzione personalizzata', price: 'Su preventivo',
      desc: 'Da concordare insieme al cliente' },
  ],
};

export const EXTRAS = {
  'Primo Compleanno': [
    { id: 'pc-book', label: 'Fotolibro 25×25 cm', price: 180, type: 'book' },
    { id: 'pc-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'pc-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'pc-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'pc-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'pc-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 160 },
    { id: 'pc-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 80 },
  ],
  'Battesimo': [
    { id: 'bat-book', label: 'Fotolibro 25×25 cm', price: 180, type: 'book' },
    { id: 'bat-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'bat-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'bat-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'bat-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'bat-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 160 },
    { id: 'bat-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 80 },
    { id: 'bat-pol-20-custom', label: 'Polaroid solo momento torta su cartoncino personalizzato — fino a 20 stampe', price: 120 },
  ],
  'Comunione': [
    { id: 'comm-book', label: 'Fotolibro 30×30 cm', price: 160, type: 'book' },
    { id: 'comm-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'comm-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'comm-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'comm-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'comm-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
    { id: 'comm-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 80 },
    { id: 'comm-pol-20-custom', label: 'Polaroid solo momento torta su cartoncino personalizzato — fino a 20 stampe', price: 120 },
  ],
  'Cresima': [
    { id: 'cres-book', label: 'Fotolibro 30×30 cm', price: 170, type: 'book' },
    { id: 'cres-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'cres-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'cres-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'cres-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'cres-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
    { id: 'cres-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 80 },
    { id: 'cres-pol-20-custom', label: 'Polaroid solo momento torta su cartoncino personalizzato — fino a 20 stampe', price: 120 },
  ],
  '18° Compleanno': [
    { id: '18-book', label: 'Fotolibro 25×25 cm', price: 150, type: 'book' },
    { id: '18-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: '18-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: '18-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: '18-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: '18-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
    { id: '18-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 70 },
  ],
  'Laurea': [
    { id: 'laurea-book', label: 'Fotolibro 25×25 cm', price: 190, type: 'book' },
    { id: 'laurea-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'laurea-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'laurea-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'laurea-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'laurea-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
    { id: 'laurea-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 70 },
  ],
  '25° Anniversario di Matrimonio': [
    { id: 'ann25-ext', label: 'Copertura fotografica estesa della festa', price: 120 },
    { id: 'ann25-book', label: 'Fotolibro 30×30 cm', price: 250, type: 'book' },
    { id: 'ann25-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'ann25-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'ann25-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'ann25-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'ann25-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 70 },
    { id: 'ann25-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
  ],
  '50° Anniversario di Matrimonio': [
    { id: 'ann50-book', label: 'Fotolibro 25×25 cm', price: 230, type: 'book' },
    { id: 'ann50-card-l', label: 'Cartoncino ricordo 15×22 cm — consegna differita', price: 2, unit: true },
    { id: 'ann50-card-l-sal', label: 'Cartoncino ricordo 15×22 cm — consegna in sala', price: 3, surcharge: 50, unit: true },
    { id: 'ann50-card-s', label: 'Cartoncino ricordo 10×15 cm — consegna differita', price: 1.5, unit: true },
    { id: 'ann50-card-s-sal', label: 'Cartoncino ricordo 10×15 cm — consegna in sala', price: 2, surcharge: 40, unit: true },
    { id: 'ann50-pol-100', label: 'Polaroid aggiuntive — fino a 100 stampe', price: 150 },
    { id: 'ann50-pol-20', label: 'Polaroid solo momento torta — fino a 20 stampe', price: 70 },
  ],
};

// Soluzioni che prevedono sessione a casa
export const SOLUTIONS_WITH_HOME = [
  'Soluzione 2 — Sessione a casa',
  'Soluzione 3 — Giornata completa',
];

// Mappa per recuperare i prezzi
export function getPrice(solutionId) {
  for (const category of Object.values(SOLUTIONS)) {
    const sol = category.find(s => s.id === solutionId);
    if (sol) return sol.price;
  }
  return null;
}

export function getExtraPrice(extraId) {
  for (const category of Object.values(EXTRAS)) {
    const extra = category.find(e => e.id === extraId);
    if (extra) return { price: extra.price, unit: extra.unit || false, surcharge: extra.surcharge || 0 };
  }
  return null;
}

export function getSolution(solutionId) {
  for (const category of Object.values(SOLUTIONS)) {
    const sol = category.find(s => s.id === solutionId);
    if (sol) return sol;
  }
  return null;
}

export function getExtra(extraId) {
  for (const category of Object.values(EXTRAS)) {
    const extra = category.find(e => e.id === extraId);
    if (extra) return extra;
  }
  return null;
}

// Il form salva gli id (es. 'bat-2'). Nelle email, nei messaggi e sul calendario
// serve il nome leggibile, altrimenti arriva "Soluzione scelta: bat-2".
export function getSolutionLabel(solutionId) {
  return getSolution(solutionId)?.label || solutionId || '';
}

export function getExtraLabel(extraId) {
  return getExtra(extraId)?.label || extraId || '';
}

export function formatPrice(price) {
  if (typeof price !== 'number') return price || '';
  return `${Number.isInteger(price) ? price : price.toFixed(2).replace('.', ',')}€`;
}

// Riga pronta da leggere: nome della soluzione e prezzo.
export function describeSolution(solutionId) {
  const sol = getSolution(solutionId);
  if (!sol) return solutionId || '';
  const prezzo = formatPrice(sol.price);
  return prezzo ? `${sol.label} · ${prezzo}` : sol.label;
}

// Idem per gli extra. I cartoncini si pagano a pezzo: qui il conto e' gia' fatto.
export function describeExtra(extraId, quantita = 1) {
  const extra = getExtra(extraId);
  if (!extra) return extraId || '';
  if (extra.unit) {
    const pezzi = Math.max(1, Number(quantita) || 1);
    const totale = extra.price * pezzi + (extra.surcharge || 0);
    const magg = extra.surcharge ? ` (incluso supplemento ${formatPrice(extra.surcharge)})` : '';
    return `${extra.label} × ${pezzi} · ${formatPrice(totale)}${magg}`;
  }
  return `${extra.label} · ${formatPrice(extra.price)}`;
}

// Lo stesso conto che il cliente vede nel form: form, email e calendario
// devono dire la stessa cifra.
export function calcolaTotale(form = {}) {
  const pezzi = Math.max(1, Number(form.quantitaCartoncini) || 1);
  let totale = 0;

  const prezzoSoluzione = getPrice(form.soluzione);
  if (typeof prezzoSoluzione === 'number') totale += prezzoSoluzione;

  const aggiungi = (id) => {
    const e = getExtraPrice(id);
    if (!e || typeof e.price !== 'number') return;
    totale += e.unit ? e.price * pezzi + (e.surcharge || 0) : e.price;
  };

  (form.extra || []).forEach(aggiungi);
  if (form.polaroid) aggiungi(form.polaroid);
  if (form.cartoncino) aggiungi(form.cartoncino);

  return Math.round(totale * 100) / 100;
}
