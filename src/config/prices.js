// Configurazione prezzi del sistema prenotazioni.
//
// ATTENZIONE: file generato. Non modificarlo a mano.
// I prezzi arrivano dai preventivi (Documents/preventivi/_sorgente/dati/*.json):
// cambia li' e rilancia  node genera-listino.mjs
// Cosi' il prezzo che il cliente legge nel preventivo e quello che trova qui
// restano sempre gli stessi.
//
// Generato il 16/08/2026

export const SOLUTIONS = {
  'Primo Compleanno': [
    { id: 'pc-1', label: 'Soluzione 1 — Reportage completo', price: 240 },
    { id: 'pc-2', label: 'Soluzione 2 — Sessione a casa', price: 210 },
    { id: 'pc-3', label: 'Soluzione 3 — Solo momento torta', price: 170 },
  ],
  'Battesimo': [
    { id: 'bat-1', label: 'Soluzione 1 — Solo celebrazione', price: 100 },
    { id: 'bat-2', label: 'Soluzione 2 — Messa e ristorante', price: 240 },
    { id: 'bat-3', label: 'Soluzione 3 — Giornata completa', price: 350 },
  ],
  'Comunione': [
    { id: 'comm-1', label: 'Soluzione 1 — Celebrazione + ritratti', price: 200 },
    { id: 'comm-2', label: 'Soluzione 2 — Giornata completa', price: 320 },
  ],
  'Cresima': [
    { id: 'cres-1', label: 'Soluzione 1 — Celebrazione + ritratti', price: 220 },
    { id: 'cres-2', label: 'Soluzione 2 — Giornata completa', price: 350 },
  ],
  '18° Compleanno': [
    { id: '18-1', label: 'Soluzione 1 — Reportage completo', price: 250 },
    { id: '18-2', label: 'Soluzione 2 — Shooting + festa', price: 380 },
    { id: '18-3', label: 'Soluzione 3 — Fino al primo ballo', price: 190 },
    { id: '18-4', label: 'Soluzione 4 — Essenziale', price: 90 },
  ],
  'Laurea — Seduta': [
    { id: 'laurea-seduta-1', label: 'Soluzione 1 — La seduta in facoltà', price: 150 },
  ],
  'Laurea — Festa': [
    { id: 'laurea-festa-1', label: 'Soluzione 1 — Reportage completo', price: 250 },
    { id: 'laurea-festa-2', label: 'Soluzione 2 — Fino al primo ballo', price: 180 },
    { id: 'laurea-festa-3', label: 'Soluzione 3 — Essenziale', price: 80 },
  ],
  '25° Anniversario di Matrimonio': [
    { id: 'ann25-1', label: 'Soluzione 1 — Solo celebrazione', price: 120 },
    { id: 'ann25-2', label: 'Soluzione 2 — Messa e ristorante', price: 280 },
    { id: 'ann25-3', label: 'Soluzione 3 — Giornata completa', price: 360 },
  ],
  '50° Anniversario di Matrimonio': [
    { id: 'ann50-1', label: 'Soluzione 1 — Solo celebrazione', price: 100 },
    { id: 'ann50-2', label: 'Soluzione 2 — Messa e momento torta', price: 220 },
    { id: 'ann50-3', label: 'Soluzione 3 — Giornata completa', price: 360 },
  ],
  'Altro': [
    { id: 'altro-1', label: 'Soluzione personalizzata', price: 'Su preventivo' },
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

// Il form salva gli id (es. 'bat-2'). Nelle email e nei messaggi serve il nome
// leggibile, altrimenti arriva "Soluzione scelta: bat-2".
export function getSolutionLabel(solutionId) {
  for (const category of Object.values(SOLUTIONS)) {
    const sol = category.find(s => s.id === solutionId);
    if (sol) return sol.label;
  }
  return solutionId || '';
}

export function getExtraLabel(extraId) {
  for (const category of Object.values(EXTRAS)) {
    const extra = category.find(e => e.id === extraId);
    if (extra) return extra.label;
  }
  return extraId || '';
}
