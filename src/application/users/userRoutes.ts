import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import userControllers from './userControllers';
const routes = Router();

// routes.get('/', userControllers.findAll);
// routes.get('/search', userControllers.findByQuery);
routes.get('/:id', idChecker, userControllers.findById);
routes.post('/create', userControllers.create);
routes.post('/login', userControllers.login);
routes.post('/logout', userControllers.logout);
routes.put('/update/:id', idChecker, userControllers.update);
routes.delete('/delete/:id', idChecker, userControllers.delete);

export default routes;
