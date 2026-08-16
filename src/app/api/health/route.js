import { NextResponse } from 'next/server'
import { verifyCalendarConnection } from '@/lib/google-calendar'

export async function GET() {
  try {
    const result = await verifyCalendarConnection()
    
    return NextResponse.json({
      success: true,
      service: 'Google Calendar',
      status: result.success ? 'connected' : 'disconnected',
      message: result.message,
      eventsCount: result.eventsCount || 0
    }, { status: result.success ? 200 : 503 })
    
  } catch (err) {
    return NextResponse.json({
      success: false,
      service: 'Google Calendar',
      status: 'error',
      message: err.message || 'Errore sconosciuto'
    }, { status: 503 })
  }
}