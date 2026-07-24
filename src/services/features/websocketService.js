class ClassroomWebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isExplicitlyClosed = false;
  }

  /**
   * Connect to Django Channels WebSocket Endpoint
   * @param {string|number} classroomId 
   */
  connect(classroomId) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    const token = localStorage.getItem('token') || '';
    const email = localStorage.getItem('user_email') || '';
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//127.0.0.1:8000/ws/classroom/${classroomId}/?token=${token}&email=${encodeURIComponent(email)}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('✅ Connected to Classroom WebSocket');
      this.reconnectAttempts = 0;
      this.triggerEvent('connection_status', { connected: true });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type) {
          this.triggerEvent(data.type, data.payload || data);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onerror = (error) => {
      if (this.isExplicitlyClosed) return;
      console.error('❌ WebSocket Error:', error);
    };

    this.socket.onclose = (event) => {
      this.triggerEvent('connection_status', { connected: false });

      if (this.isExplicitlyClosed) {
        console.log('🔌 WebSocket closed intentionally.');
        return;
      }
      
      console.log('⚠️ WebSocket disconnected:', event.reason);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
        setTimeout(() => this.connect(classroomId), 3000);
      }
    };
  }

  send(type, payload = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload }));
    } else {
      console.warn('Cannot send message, WebSocket is not open.');
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    if (!this.listeners.has(eventType)) return;
    const callbacks = this.listeners.get(eventType).filter(cb => cb !== callback);
    this.listeners.set(eventType, callbacks);
  }

  triggerEvent(eventType, payload) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => callback(payload));
    }
  }

  disconnect() {
    if (this.socket) {
      this.isExplicitlyClosed = true;
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close();
      } else if (this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.onopen = () => {
          this.socket.close();
        };
      }
      this.socket = null;
      this.listeners.clear();
    }
  }
}

export const websocketService = new ClassroomWebSocketService();
export default websocketService;