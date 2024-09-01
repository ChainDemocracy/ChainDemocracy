import { Router } from 'express';

export const Routes = (router: Router) => {
  router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to backend server!' });
  });
};
