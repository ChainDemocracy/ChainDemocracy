import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Routes } from 'Routes/Routes';
import { MainApp } from 'src/app/types/MainApp';

export const setupRoutes = (app: MainApp) => {
  app.expressRouter.use(express.json({ limit: '50mb' }));
  app.expressRouter.use(cookieParser());
  app.expressRouter.use(express.urlencoded({ extended: true }));
  app.expressRouter.use(cors());
  app.expressApp.use('/v1', app.expressRouter);

  Routes(app.expressRouter);

  const PORT = process.env.PORT || 4000;

  app.waitForRun
    .then(
      () =>
        new Promise<void>((resolve) => {
          app.httpServer.listen(PORT, resolve);
        }),
    )
    .then(() => {
      console.log(
        `🚀 Server ready at port ${PORT}, env: ${process.env.NODE_ENV}`,
      );
    });
};
