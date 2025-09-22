import { NextRequest, NextResponse } from 'next/server'

interface SystemMetrics {
  systemHealth: number
  totalRequests: number
  errorRate: number
  avgResponseTime: number
}

// Simulated in-memory storage
let metrics: SystemMetrics = {
  systemHealth: 50.0,
  totalRequests: 15420,
  errorRate: 2.3,
  avgResponseTime: 156
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update metrics with new values
    if (body.systemHealth !== undefined) metrics.systemHealth = body.systemHealth
    if (body.totalRequests !== undefined) metrics.totalRequests = body.totalRequests
    if (body.errorRate !== undefined) metrics.errorRate = body.errorRate
    if (body.avgResponseTime !== undefined) metrics.avgResponseTime = body.avgResponseTime
    
    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update metrics' },
      { status: 500 }
    )
  }
}