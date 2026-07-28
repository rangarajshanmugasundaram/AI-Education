class ClassroomWebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.isExplicitlyClosed = false;
  }

  /**
   * Connect to Django Channels WebSocket Endpoint
   * @param {string|number} classroomId 
   * @param {string} role
   */
  connect(classroomId, role = 'Trainer') {
    // Prevent opening duplicate sockets if already connected or handshaking
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) return;
      if (this.socket.readyState === WebSocket.CONNECTING) return;
    }

    this.isExplicitlyClosed = false;
    const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
    const email = localStorage.getItem('user_email') || 'trainer1@gmail.com';
    const userRole = localStorage.getItem('user_role') || role || 'Trainer';

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//127.0.0.1:8000/ws/classroom/${classroomId}/?token=${token}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(userRole)}`;

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
      // Only log if connection is not already actively closed/unmounted
      if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
        console.error('❌ WebSocket Error:', error);
      }
    };

    this.socket.onclose = (event) => {
      this.triggerEvent('connection_status', { connected: false });

      if (this.isExplicitlyClosed) {
        console.log('🔌 WebSocket closed intentionally.');
        return;
      }

      console.log('⚠️ WebSocket disconnected:', event.reason || 'Network disconnect');

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
        setTimeout(() => this.connect(classroomId, userRole), 3000);
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
    const callbacks = this.listeners.get(eventType).filter((cb) => cb !== callback);
    this.listeners.set(eventType, callbacks);
  }

  triggerEvent(eventType, payload) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach((callback) => callback(payload));
    }
  }

  // 🌟 SAFE DISCONNECT: Prevents "WebSocket closed before connection established" errors
  disconnect() {
    if (this.socket) {
      this.isExplicitlyClosed = true;
      const currentSocket = this.socket;
      this.socket = null; // Clear primary reference immediately

      // Mute error callbacks during tearing down
      currentSocket.onerror = () => {};

      if (currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.close(1000, 'User left intentionally');
      } else if (currentSocket.readyState === WebSocket.CONNECTING) {
        // Wait for connection to open cleanly before closing with 1000 status
        currentSocket.onopen = () => {
          currentSocket.close(1000, 'User left intentionally');
        };
      }
    }
  }
}

export const websocketService = new ClassroomWebSocketService();
export default websocketService;