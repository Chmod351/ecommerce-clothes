import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import productsController from './productControllers';
const routes = Router();

routes.get('/', productsController.findAll);
routes.get('/search', productsController.findByQuery);
routes.get('/:id', idChecker, productsController.findById);
routes.post('/create', productsController.create);
routes.put('/update/:id', idChecker, productsController.update);
routes.delete('/delete/:id', idChecker, productsController.delete);

export default routes;
