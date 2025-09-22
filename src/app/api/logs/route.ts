import { NextRequest, NextResponse } from 'next/server'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  endpoint: string
}

// Simulated in-memory storage
let logs: LogEntry[] = [
  { id: '1', timestamp: '2024-01-15 10:30:45', level: 'info', message: 'System started successfully', endpoint: 'System' },
  { id: '2', timestamp: '2024-01-15 10:31:12', level: 'info', message: 'Todos API endpoint initialized', endpoint: 'Todos API' },
  { id: '3', timestamp: '2024-01-15 10:32:03', level: 'warning', message: 'High response time detected', endpoint: 'Comments API' },
  { id: '4', timestamp: '2024-01-15 10:33:21', level: 'error', message: 'Database connection failed', endpoint: 'Users API' },
  { id: '5', timestamp: '2024-01-15 10:34:15', level: 'info', message: 'Health check completed', endpoint: 'System' }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { level, message, endpoint } = body
    
    if (!level || !message || !endpoint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      level,
      message,
      endpoint
    }
    
    logs.unshift(newLog) // Add to beginning of array
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs = logs.slice(0, 100)
    }
    
    return NextResponse.json({
      success: true,
      data: newLog
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create log entry' },
      { status: 500 }
    )
  }
}