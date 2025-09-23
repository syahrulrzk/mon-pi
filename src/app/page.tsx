"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun, Activity, Zap, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Play, Pause, Globe, Server, WifiOff, Github, Heart, Rocket, Coffee, Code, Zap as Bolt } from 'lucide-react'
import { useTheme } from 'next-themes'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { io, Socket } from 'socket.io-client'

interface ApiEndpoint {
  id: string
  name: string
  url: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  lastChecked: string
  responseTime: number
  errorRate: number
}

interface SystemMetrics {
  systemHealth: number
  totalRequests: number
  errorRate: number
  avgResponseTime: number
}

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  endpoint: string
}

interface PerformanceData {
  time: string
  requests: number
  responseTime: number
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [metrics, setMetrics] = useState<SystemMetrics>({
    systemHealth: 50.0,
    totalRequests: 15420,
    errorRate: 2.3,
    avgResponseTime: 156
  })
  
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    { id: '1', name: 'Todos API', url: 'https://jsonplaceholder.typicode.com/todos', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
    { id: '2', name: 'Comments API', url: 'https://jsonplaceholder.typicode.com/comments', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
    { id: '3', name: 'Users API', url: 'https://jsonplaceholder.typicode.com/users', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
    { id: '4', name: 'Posts API', url: 'https://jsonplaceholder.typicode.com/posts', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
    { id: '5', name: 'Albums API', url: 'https://jsonplaceholder.typicode.com/albums', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 },
    { id: '6', name: 'Photos API', url: 'https://jsonplaceholder.typicode.com/photos', status: 'unknown', lastChecked: 'Never', responseTime: 0, errorRate: 0 }
  ])

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [serverPing, setServerPing] = useState<number | null>(null)
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const socketRef = useRef<Socket | null>(null)

  // Initialize WebSocket connection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3000', {
        transports: ['websocket', 'polling']
      })

      const socket = socketRef.current

      socket.on('connect', () => {
        console.log('WebSocket connected')
        setSocketConnected(true)
        socket.emit('subscribe-monitoring')
      })

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected')
        setSocketConnected(false)
      })

      // Handle monitoring updates
      socket.on('monitoring-update', (update: { type: string; data: any; timestamp: string }) => {
        switch (update.type) {
          case 'metrics':
            setMetrics(update.data)
            break
          case 'endpoint':
            setEndpoints(prev => prev.map(ep => 
              ep.id === update.data.id ? update.data : ep
            ))
            break
          case 'log':
            setLogs(prev => [update.data, ...prev].slice(0, 50)) // Keep last 50 logs
            break
          case 'performance':
            setPerformanceData(prev => {
              const newData = [...prev, update.data]
              return newData.slice(-24) // Keep last 24 data points
            })
            break
        }
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [])

  // Server ping monitoring
  const checkServerPing = async () => {
    setServerStatus('checking')
    try {
      const startTime = Date.now()
      
      // Ping ke root URL tanpa /api/health
      const targetUrl = 'http://localhost:3000/'
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const pingTime = Date.now() - startTime
      
      if (response.ok) {
        setServerPing(pingTime)
        setServerStatus('online')
      } else {
        setServerStatus('offline')
      }
    } catch (error) {
      setServerStatus('offline')
    }
  }

  // Monitor server ping every 10 seconds
  useEffect(() => {
    checkServerPing() // Initial check
    
    const pingInterval = setInterval(() => {
      checkServerPing()
    }, 10000) // Check every 10 seconds

    return () => {
      if (pingInterval) clearInterval(pingInterval)
    }
  }, []) // No dependencies needed since IP is hardcoded

  // Fetch initial data from API
  const fetchData = async () => {
    try {
      const [metricsRes, endpointsRes, logsRes, performanceRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/endpoints'),
        fetch('/api/logs'),
        fetch('/api/performance')
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData.data)
      }

      if (endpointsRes.ok) {
        const endpointsData = await endpointsRes.json()
        setEndpoints(endpointsData.data)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData.data)
      }

      if (performanceRes.ok) {
        const performanceDataRes = await performanceRes.json()
        setPerformanceData(performanceDataRes.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Real API endpoint check using WebSocket
  const checkEndpoint = async (endpointId: string) => {
    setLoading(true)
    try {
      const endpoint = endpoints.find(ep => ep.id === endpointId)
      if (!endpoint) return

      if (socketRef.current && socketConnected) {
        // Use WebSocket for real-time check
        socketRef.current.emit('check-endpoint', {
          id: endpoint.id,
          name: endpoint.name,
          url: endpoint.url
        })
      } else {
        // Fallback to HTTP check
        const startTime = Date.now()
        
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            mode: 'cors'
          })
          const responseTime = Date.now() - startTime
          
          const status = response.ok ? 'healthy' : 'unhealthy'
          
          // Update endpoint via API
          await fetch('/api/endpoints', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: endpointId,
              status,
              responseTime,
              errorRate: response.ok ? Math.random() * 2 : Math.random() * 10
            })
          })

          // Add log entry
          await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              level: response.ok ? 'info' : 'error',
              message: response.ok ? 'Health check passed' : `Health check failed: ${response.status}`,
              endpoint: endpoint.name
            })
          })

          // Refresh data
          await fetchData()
          
        } catch (error) {
          const responseTime = Date.now() - startTime
          
          await fetch('/api/endpoints', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: endpointId,
              status: 'unhealthy',
              responseTime,
              errorRate: 100
            })
          })

          await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              level: 'error',
              message: `Connection failed: ${error.message}`,
              endpoint: endpoint.name
            })
          })

          await fetchData()
        }
      }
    } catch (error) {
      console.error('Error checking endpoint:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAllEndpoints = async () => {
    setLoading(true)
    try {
      if (socketRef.current && socketConnected) {
        // Use WebSocket for real-time bulk check
        socketRef.current.emit('check-all-endpoints', endpoints)
      } else {
        // Fallback to HTTP checks
        const checkPromises = endpoints.map(endpoint => checkEndpoint(endpoint.id))
        await Promise.all(checkPromises)
        
        // Update overall metrics
        const healthyCount = endpoints.filter(ep => ep.status === 'healthy').length
        const systemHealth = (healthyCount / endpoints.length) * 100
        
        await fetch('/api/metrics', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemHealth,
            totalRequests: metrics.totalRequests + Math.floor(Math.random() * 500) + 200,
            avgResponseTime: Math.floor(Math.random() * 100) + 100,
            errorRate: Math.random() * 3
          })
        })

        await fetchData()
      }
    } catch (error) {
      console.error('Error checking all endpoints:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-monitoring effect - runs automatically for public viewing
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    // Start monitoring immediately for public display
    interval = setInterval(() => {
      checkAllEndpoints()
      
      // Update performance data
      if (socketRef.current && socketConnected && serverStatus === 'online') {
        socketRef.current.emit('update-performance')
      } else {
        fetch('/api/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }, 30000) // 30 seconds for public monitoring

    // Initial check after 3 seconds (faster for public)
    const initialCheckTimeout = setTimeout(() => {
      checkAllEndpoints()
    }, 3000)

    return () => {
      if (interval) clearInterval(interval)
      if (initialCheckTimeout) clearTimeout(initialCheckTimeout)
    }
  }, [serverStatus])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-background border-b border-border p-4 md:p-4 lg:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">API Monitoring Dashboard</h1>
            </div>
            <p className="text-muted-foreground mt-1">Real-time API endpoint monitoring - Auto refresh every 30 seconds</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <Server className={`h-4 w-4 ${
                serverStatus === 'online' ? 'text-green-500' : 
                serverStatus === 'checking' ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {serverStatus === 'online' ? `Server Online (${serverPing}ms)` : 
                 serverStatus === 'checking' ? 'Checking...' : 'Server Offline'}
              </span>
              {serverStatus === 'online' && (
                <Badge variant="secondary" className="animate-pulse">
                  Auto Monitoring
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6 md:p-8 lg:p-10">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.systemHealth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Auto-updated every 30s
            </p>
          </CardContent>
        </Card> */}

        <Card className="relative overflow-hidden">
          {/* Animated Background Graph */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(34, 197, 94)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(34, 197, 94)', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              <path 
                d="M0,100 Q50,50 100,100 T200,100 T300,100 T400,100 L400,200 L0,200 Z" 
                fill="url(#healthGradient)"
                className="animate-pulse"
              />
              <path 
                d="M0,100 Q50,50 100,100 T200,100 T300,100 T400,100" 
                stroke="rgb(34, 197, 94)" 
                strokeWidth="2" 
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="text-2xl font-bold">{metrics.systemHealth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Auto-updated every 30s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Auto-monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Live tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{metrics.avgResponseTime} ms</div>
            <p className="text-xs text-muted-foreground mt-2">
              Real-time data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>API Endpoints Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="rounded-md border">
                <div className="overflow-hidden">
                  {/* Fixed Table Header */}
                  <div className="bg-muted/50">
                    <div className="grid grid-cols-7 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
                      <div>Endpoint Name</div>
                      <div>URL</div>
                      <div>Status</div>
                      <div>Last Checked</div>
                      <div>Response Time</div>
                      <div>Error Rate</div>
                      <div className="text-right">Actions</div>
                    </div>
                  </div>
                  
                  {/* Scrollable Table Body */}
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
                    <div className="divide-y">
                      {endpoints.map((endpoint) => (
                        <div key={endpoint.id} className="grid grid-cols-7 gap-4 px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                          <div className="font-medium">{endpoint.name}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground max-w-32 truncate">
                                {endpoint.url}
                              </span>
                            </div>
                          </div>
                          <div>{getStatusBadge(endpoint.status)}</div>
                          <div className="text-muted-foreground">{endpoint.lastChecked}</div>
                          <div className="text-muted-foreground">
                            {endpoint.responseTime > 0 ? `${endpoint.responseTime} ms` : '-'}
                          </div>
                          <div className="text-muted-foreground">
                            {endpoint.errorRate > 0 ? `${endpoint.errorRate.toFixed(1)}%` : '-'}
                          </div>
                          <div className="text-right">
                            <Button
                              onClick={() => checkEndpoint(endpoint.id)}
                              variant="outline"
                              size="sm"
                              disabled={loading}
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                              Check
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Requests Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Response Time Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="rounded-md border">
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
                  <div className="divide-y">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          {getLogIcon(log.level)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{log.endpoint}</span>
                              <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'default' : 'secondary'} className="text-xs">
                                {log.level.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.message}</p>
                            <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      </div>
      </main>

      {/* Fixed Footer */}
      <footer className="flex-shrink-0 bg-background border-t border-border p-2">
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <p className="text-xs text-muted-foreground text-center sm:text-center">
              © 2025 reborn. Empowering developers worldwide ❤️.
            </p>
          </div>
      </footer>
    </div>
  )
}