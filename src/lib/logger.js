// Logger semplificato per il progetto

const logPrefix = '[BookingFotografo]'

export function info(message, ...args) {
  console.log(`${logPrefix} [INFO] ${message}`, ...args)
}

export function warn(message, ...args) {
  console.warn(`${logPrefix} [WARN] ${message}`, ...args)
}

// Alias principale per error logging
// Esposto anche come 'error' per retrocompatibilità ma deprecato
export function logError(message, ...args) {
  try {
    console.error(`${logPrefix} [ERROR] ${message}`, ...args)
  } catch (e) {
    // Fallback in caso di errori nel logging
    console.error(`[BookingFotografo] [ERROR] Logging failed:`, message, ...args)
  }
}

// Alias retrocompatibile (DEPRECATO - usare logError invece)
export { logError as error }

export function debug(message, ...args) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`${logPrefix} [DEBUG] ${message}`, ...args)
  }
}

// Funzione helper per loggare oggetti complessi
export function logObject(label, obj) {
  if (process.env.NODE_ENV === 'development') {
    info(`${label}:`, JSON.stringify(obj, null, 2))
  } else {
    info(`${label}:`, { ...obj })
  }
}

// Funzione per loggare errori con contesto completo
export function logFullError(errorObj, context = {}) {
  if (process.env.NODE_ENV === 'development') {
    logError('Errore completo:', {
      message: errorObj.message,
      stack: errorObj.stack,
      context,
      timestamp: new Date().toISOString()
    })
  } else {
    logError('Errore:', {
      message: errorObj.message,
      context,
      timestamp: new Date().toISOString()
    })
  }
}