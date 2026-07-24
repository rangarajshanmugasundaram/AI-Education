import { createContext, useContext, useEffect, useState, useRef } from 'react';
import websocketService from '../services/features/websocketService';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(websocketService);

  useEffect(() => {
    // Shared websocket state listeners
    const service = socketRef.current;
    
    // Check baseline connection state
    if (service && service.socket) {
      setIsConnected(service.socket.readyState === WebSocket.OPEN);
    }

    return () => {
      // Optional cleanup on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketService: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};