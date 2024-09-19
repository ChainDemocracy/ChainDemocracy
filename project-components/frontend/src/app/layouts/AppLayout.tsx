import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="w-full h-full bg-gray-900 flex flex-col gap-4 ">
        <Outlet />
      </div>
    </>
  );
};
