import { Express, Router } from 'express';
import { Server } from 'http';

export interface MainApp {
  expressApp: Express;
  expressRouter: Router;
  httpServer: Server;

  waitForRun: Promise<boolean>;
  run: () => void;
}
