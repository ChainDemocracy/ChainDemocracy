import http from 'http';
import express from 'express';
import { MainApp } from 'src/app/types/MainApp';

export const createMainApp = (): MainApp => {
  const expressApp = express();
  const expressRouter = express.Router();
  const httpServer = http.createServer(expressApp);

  let run: () => void;

  const waitForRun = new Promise<boolean>((resolve) => {
    run = () => resolve(true);
  });

  return {
    expressApp,
    expressRouter,
    httpServer,

    waitForRun,
    run,
  };
};
