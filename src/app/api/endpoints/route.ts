import { NextRequest, NextResponse } from 'next/server'

interface ApiEndpoint {
  id: string
  name: string
  url: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  lastChecked: string
  responseTime: number
  errorRate: number
}

// Simulated in-memory storage with real URLs
let endpoints: ApiEndpoint[] = [
  { id: '1', name: 'API Logs', url: 'http://localhost:3000/api/logs', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
  { id: '2', name: 'API Metrics', url: 'http://localhost:3000/api/metrics', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
  { id: '3', name: 'API User ', url: 'https://jsonplaceholder.typicode.com/users', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
  { id: '4', name: 'API Performance', url: 'http://localhost:3000/api/performance', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 }
  
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: endpoints
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch endpoints' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, responseTime, errorRate } = body
    
    const endpointIndex = endpoints.findIndex(ep => ep.id === id)
    if (endpointIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Endpoint not found' },
        { status: 404 }
      )
    }
    
    endpoints[endpointIndex] = {
      ...endpoints[endpointIndex],
      status: status || endpoints[endpointIndex].status,
      lastChecked: new Date().toLocaleTimeString(),
      responseTime: responseTime || endpoints[endpointIndex].responseTime,
      errorRate: errorRate || endpoints[endpointIndex].errorRate
    }
    
    return NextResponse.json({
      success: true,
      data: endpoints[endpointIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update endpoint' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url } = body
    
    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newEndpoint: ApiEndpoint = {
      id: Date.now().toString(),
      name,
      url,
      status: 'unknown',
      lastChecked: 'Never',
      responseTime: 0,
      errorRate: 0
    }
    
    endpoints.push(newEndpoint)
    
    return NextResponse.json({
      success: true,
      data: newEndpoint
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create endpoint' },
      { status: 500 }
    )
  }
}