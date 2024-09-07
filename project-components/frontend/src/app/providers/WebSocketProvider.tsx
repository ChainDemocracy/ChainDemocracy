import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserContext } from './UserProvider';

interface WebSocketType {
  ws?: WebSocket;
}

export const WebSocketContext = createContext<WebSocketType | null>(null);

export const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const user = useContext(UserContext);

  useEffect(() => {
    const url = process.env.REACT_APP_WS_SERVER ?? '';
    if (!url) {
      console.error('WebSocket URL is not defined');
      return;
    }
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(socket);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (!ws) return <>{children}</>;

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};
