import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserContext } from './UserProvider';
import io, { Socket } from 'socket.io-client';

interface WebSocketType {
  socket: Socket;
}

export const WebSocketContext = createContext<WebSocketType | null>(null);

export const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useContext(UserContext);

  useEffect(() => {
    const url = process.env.REACT_APP_WS_SERVER ?? 'http://localhost:4444';
    if (!user?.walletAddress) return;
    const socketIo = io(url);

    socketIo.on('connect', () => {
      console.log('Socket.io connected');
      socketIo.emit('login', { walletId: user?.walletAddress });
    });

    socketIo.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user?.walletAddress]);

  if (!socket) return <>{children}</>;

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
