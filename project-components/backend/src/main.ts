import { createMainApp } from 'src/app/createMainApp';
import { setupRoutes } from './express/setupRoutes';
import dotenv from 'dotenv';
import { setupWeb3 } from './Web3/SetupWeb3';

dotenv.config({
  path: ['.env.local', '.env'],
});

export const main = async () => {
  const app = createMainApp();

  setupRoutes(app);
  setupWeb3();
  app.run();
};
