import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import { MainPage } from './pages/mainPage';
import { AppProviders } from './app/providers/AppProviders';
import { AppLayout } from './app/layouts/AppLayout';

function App() {
  const routes = createRoutesFromElements(
    <Route element={<AppProviders />}>
      <Route element={<AppLayout />}>
        <Route index element={<MainPage />}></Route>
      </Route>
    </Route>,
  );
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
