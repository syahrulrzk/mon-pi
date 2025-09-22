import { NextRequest, NextResponse } from 'next/server'

interface PerformanceData {
  time: string
  requests: number
  responseTime: number
}

// Generate initial performance data with realistic values
function generatePerformanceData(): PerformanceData[] {
  const data: PerformanceData[] = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000) // 30 minute intervals
    const formattedTime = time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    data.push({
      time: formattedTime,
      requests: Math.floor(Math.random() * 200) + 100, // 100-300 requests
      responseTime: Math.floor(Math.random() * 150) + 50 // 50-200ms
    })
  }
  
  return data
}

// Simulated in-memory storage
let performanceData: PerformanceData[] = generatePerformanceData()

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: performanceData
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { time, requests, responseTime } = body
    
    if (time !== undefined && requests !== undefined && responseTime !== undefined) {
      // Add specific data point
      const newDataPoint: PerformanceData = {
        time,
        requests,
        responseTime
      }
      
      performanceData.push(newDataPoint)
    } else {
      // Generate new data point automatically
      const now = new Date()
      const formattedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      const newDataPoint: PerformanceData = {
        time: formattedTime,
        requests: Math.floor(Math.random() * 200) + 100,
        responseTime: Math.floor(Math.random() * 150) + 50
      }
      
      performanceData.push(newDataPoint)
    }
    
    // Keep only last 24 data points (12 hours of data with 30-minute intervals)
    if (performanceData.length > 24) {
      performanceData = performanceData.slice(-24)
    }
    
    return NextResponse.json({
      success: true,
      data: performanceData[performanceData.length - 1]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add performance data' },
      { status: 500 }
    )
  }
}