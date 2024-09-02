import { Outlet } from 'react-router-dom';
import { UserProvider } from './UserProvider';

export const AppProviders = () => {
   return (
      <UserProvider>
         <Outlet />
      </UserProvider>
   );
};
