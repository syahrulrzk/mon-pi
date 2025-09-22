import { Server } from 'socket.io';

interface MonitoringUpdate {
  type: 'metrics' | 'endpoint' | 'log' | 'performance'
  data: any
  timestamp: string
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join monitoring room
    socket.join('monitoring');
    
    // Handle monitoring subscription
    socket.on('subscribe-monitoring', () => {
      console.log('Client subscribed to monitoring updates:', socket.id);
      socket.emit('monitoring-subscribed', {
        message: 'Successfully subscribed to real-time monitoring updates',
        timestamp: new Date().toISOString()
      });
    });

    // Handle manual endpoint check
    socket.on('check-endpoint', async (endpointData: { id: string; name: string; url: string }) => {
      try {
        const startTime = Date.now();
        
        // Simulate API call to the endpoint
        const response = await fetch(endpointData.url, {
          method: 'GET',
          mode: 'cors'
        });
        
        const responseTime = Date.now() - startTime;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        const update: MonitoringUpdate = {
          type: 'endpoint',
          data: {
            id: endpointData.id,
            name: endpointData.name,
            status,
            responseTime,
            errorRate: response.ok ? Math.random() * 2 : Math.random() * 10,
            lastChecked: new Date().toLocaleTimeString()
          },
          timestamp: new Date().toISOString()
        };
        
        // Broadcast update to all monitoring clients
        io.to('monitoring').emit('monitoring-update', update);
        
        // Add log entry
        const logUpdate: MonitoringUpdate = {
          type: 'log',
          data: {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            level: response.ok ? 'info' : 'error',
            message: response.ok ? 'Health check passed' : `Health check failed: ${response.status}`,
            endpoint: endpointData.name
          },
          timestamp: new Date().toISOString()
        };
        
        io.to('monitoring').emit('monitoring-update', logUpdate);
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        const update: MonitoringUpdate = {
          type: 'endpoint',
          data: {
            id: endpointData.id,
            name: endpointData.name,
            status: 'unhealthy',
            responseTime,
            errorRate: 100,
            lastChecked: new Date().toLocaleTimeString()
          },
          timestamp: new Date().toISOString()
        };
        
        io.to('monitoring').emit('monitoring-update', update);
        
        const logUpdate: MonitoringUpdate = {
          type: 'log',
          data: {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            level: 'error',
            message: `Connection failed: ${error.message}`,
            endpoint: endpointData.name
          },
          timestamp: new Date().toISOString()
        };
        
        io.to('monitoring').emit('monitoring-update', logUpdate);
      }
    });

    // Handle bulk endpoint check
    socket.on('check-all-endpoints', async (endpoints: Array<{ id: string; name: string; url: string }>) => {
      try {
        const checkPromises = endpoints.map(async (endpoint) => {
          const startTime = Date.now();
          
          try {
            const response = await fetch(endpoint.url, {
              method: 'GET',
              mode: 'cors'
            });
            
            const responseTime = Date.now() - startTime;
            const status = response.ok ? 'healthy' : 'unhealthy';
            
            return {
              id: endpoint.id,
              name: endpoint.name,
              status,
              responseTime,
              errorRate: response.ok ? Math.random() * 2 : Math.random() * 10,
              lastChecked: new Date().toLocaleTimeString()
            };
          } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
              id: endpoint.id,
              name: endpoint.name,
              status: 'unhealthy',
              responseTime,
              errorRate: 100,
              lastChecked: new Date().toLocaleTimeString()
            };
          }
        });
        
        const results = await Promise.all(checkPromises);
        
        // Calculate overall metrics
        const healthyCount = results.filter(r => r.status === 'healthy').length;
        const systemHealth = (healthyCount / results.length) * 100;
        const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
        const totalRequests = results.reduce((sum, r) => sum + Math.floor(Math.random() * 100) + 50, 0);
        const errorRate = results.reduce((sum, r) => sum + r.errorRate, 0) / results.length;
        
        // Broadcast metrics update
        const metricsUpdate: MonitoringUpdate = {
          type: 'metrics',
          data: {
            systemHealth,
            totalRequests,
            errorRate,
            avgResponseTime: Math.round(avgResponseTime)
          },
          timestamp: new Date().toISOString()
        };
        
        io.to('monitoring').emit('monitoring-update', metricsUpdate);
        
        // Broadcast individual endpoint updates
        results.forEach(result => {
          const endpointUpdate: MonitoringUpdate = {
            type: 'endpoint',
            data: result,
            timestamp: new Date().toISOString()
          };
          
          io.to('monitoring').emit('monitoring-update', endpointUpdate);
        });
        
        // Add summary log
        const logUpdate: MonitoringUpdate = {
          type: 'log',
          data: {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            level: 'info',
            message: `Bulk health check completed: ${healthyCount}/${results.length} endpoints healthy`,
            endpoint: 'System'
          },
          timestamp: new Date().toISOString()
        };
        
        io.to('monitoring').emit('monitoring-update', logUpdate);
        
      } catch (error) {
        console.error('Error in bulk endpoint check:', error);
      }
    });

    // Handle performance data update
    socket.on('update-performance', () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const performanceUpdate: MonitoringUpdate = {
        type: 'performance',
        data: {
          time: formattedTime,
          requests: Math.floor(Math.random() * 200) + 100,
          responseTime: Math.floor(Math.random() * 150) + 50
        },
        timestamp: new Date().toISOString()
      };
      
      io.to('monitoring').emit('monitoring-update', performanceUpdate);
    });

    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave('monitoring');
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to API Monitoring WebSocket Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};