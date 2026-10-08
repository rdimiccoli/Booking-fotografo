// Protegge /agenda: dentro ci sono nomi, telefoni e indirizzi dei clienti.
//
// Password nelle variabili d'ambiente di Vercel:
//   AGENDA_PASSWORD   obbligatoria. Senza, /agenda resta chiusa a chiunque.
//   AGENDA_UTENTE     facoltativa, predefinito "ruggiero"
//
// E' l'autenticazione del browser: la prima volta chiede utente e password,
// poi se la ricorda. Sul telefono funziona uguale.

import { NextResponse } from 'next/server'

export const config = { matcher: ['/agenda/:path*'] }

const chiediPassword = () =>
  new NextResponse('Accesso riservato', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Agenda", charset="UTF-8"' },
  })

export function middleware(request) {
  const password = process.env.AGENDA_PASSWORD
  const utente = process.env.AGENDA_UTENTE || 'ruggiero'

  // Senza password configurata la pagina non si apre: meglio chiusa che aperta.
  if (!password) {
    return new NextResponse(
      'Agenda non configurata: manca AGENDA_PASSWORD fra le variabili d\'ambiente.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    )
  }

  const header = request.headers.get('authorization') || ''
  if (!header.startsWith('Basic ')) return chiediPassword()

  let decodificato = ''
  try {
    decodificato = atob(header.slice(6))
  } catch {
    return chiediPassword()
  }

  const separatore = decodificato.indexOf(':')
  if (separatore < 0) return chiediPassword()

  const entrati = {
    utente: decodificato.slice(0, separatore),
    password: decodificato.slice(separatore + 1),
  }

  // Confronto a tempo costante: evita di far trapelare la password un
  // carattere alla volta dai tempi di risposta.
  const uguali = (a, b) => {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return diff === 0
  }

  if (!uguali(entrati.utente, utente) || !uguali(entrati.password, password)) {
    return chiediPassword()
  }

  return NextResponse.next()
}
