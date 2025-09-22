import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpointId, endpointName } = body
    
    if (!endpointId || !endpointName) {
      return NextResponse.json(
        { success: false, error: 'Missing endpoint information' },
        { status: 400 }
      )
    }
    
    // Simulate API health check with random results
    const isHealthy = Math.random() > 0.2 // 80% chance of being healthy
    const responseTime = Math.floor(Math.random() * 200) + 50 // 50-250ms
    const errorRate = isHealthy ? Math.random() * 2 : Math.random() * 10 // 0-2% if healthy, 0-10% if unhealthy
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    return NextResponse.json({
      success: true,
      data: {
        id: endpointId,
        name: endpointName,
        status: isHealthy ? 'healthy' : 'unhealthy',
        lastChecked: new Date().toLocaleTimeString(),
        responseTime,
        errorRate
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Health check failed' },
      { status: 500 }
    )
  }
}