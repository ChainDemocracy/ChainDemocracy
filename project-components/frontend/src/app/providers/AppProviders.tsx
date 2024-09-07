import { Outlet } from 'react-router-dom';
import { UserProvider } from './UserProvider';
import { WebSocketProvider } from './WebSocketProvider';

export const AppProviders = () => {
  return (
    <UserProvider>
      <WebSocketProvider>
        <Outlet />
      </WebSocketProvider>
    </UserProvider>
  );
};
