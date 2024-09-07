import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="w-full h-screen bg-gray-900 flex flex-col gap-4 items-center justify-center">
        <Outlet />
      </div>
    </>
  );
};
